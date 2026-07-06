import { NextRequest } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

// ---------------------------------------------------------------------------
// Validation schema (mirrors the client-side rules)
// ---------------------------------------------------------------------------
const ContactFormSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email(),
  subject: z.string().min(4).max(30),
  description: z.string().min(10).max(100),
})

// ---------------------------------------------------------------------------
// In-memory rate limiter — 3 requests per minute per IP
// NOTE: This is process-local. For multi-instance / edge deployments use
//       a shared store (e.g. Redis / Upstash) instead.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 3

const rateLimitStore = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitStore.set(ip, { count: 1, windowStart: now })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return true
  }

  record.count++
  return false
}

// ---------------------------------------------------------------------------
// WhatsApp fallback URL generator
// ---------------------------------------------------------------------------
function generateWhatsAppLink(data: z.infer<typeof ContactFormSchema>): string {
  const whatsappNumber = "7560977040"
  const message = encodeURIComponent(
    `🙋 *Hey, I'm ${data.name}!*\n\n📧 *Email:* ${data.email}\n\n💬 *Subject:* ${data.subject}\n\n📄 *Details:*\n${data.description}\n\n`
  )
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

// ---------------------------------------------------------------------------
// POST /api/contact
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  // --- Rate limiting ---
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"

  if (isRateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    )
  }

  // --- Parse & validate body ---
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ ok: false, error: "Invalid request body." }, { status: 400 })
  }

  const parsed = ContactFormSchema.safeParse(body)
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "Invalid form data. Please check your input." },
      { status: 422 }
    )
  }

  const { name, email, subject, description } = parsed.data

  // --- Send via Resend (primary) ---
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === "re_xxxxxxxxx") {
    // Key not configured — fall back to WhatsApp
    return Response.json({
      ok: true,
      channel: "whatsapp",
      whatsappUrl: generateWhatsAppLink(parsed.data),
    })
  }

  try {
    const resend = new Resend(apiKey)

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "dariogeorge21.kerala@gmail.com",
      subject: `[My Corner] ${subject}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0a0a0a;color:#fff;border-radius:8px;">
          <h2 style="margin:0 0 24px;font-size:24px;color:#fff;">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;color:#888;width:110px;vertical-align:top;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Name</td>
              <td style="padding:8px 0;color:#fff;font-size:15px;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888;vertical-align:top;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Email</td>
              <td style="padding:8px 0;color:#fff;font-size:15px;"><a href="mailto:${email}" style="color:#60a5fa;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888;vertical-align:top;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Subject</td>
              <td style="padding:8px 0;color:#fff;font-size:15px;">${subject}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#888;vertical-align:top;font-size:13px;text-transform:uppercase;letter-spacing:1px;">Message</td>
              <td style="padding:8px 0;color:#fff;font-size:15px;">${description}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #222;margin:24px 0;" />
          <p style="margin:0;color:#555;font-size:12px;">Sent via My Corner contact form · dariogeorge.in</p>
        </div>
      `,
    })

    if (error) {
      console.error("[contact/route] Resend error:", error)
      // Resend failed — offer WhatsApp fallback
      return Response.json({
        ok: true,
        channel: "whatsapp",
        whatsappUrl: generateWhatsAppLink(parsed.data),
        warning: "Email delivery failed. Opening WhatsApp as a fallback.",
      })
    }

    console.log(`[contact/route] Email sent from ${email} — subject: "${subject}"`)
    return Response.json({ ok: true, channel: "email" })
  } catch (err) {
    console.error("[contact/route] Unexpected error:", err)
    // Network / SDK error — offer WhatsApp fallback
    return Response.json({
      ok: true,
      channel: "whatsapp",
      whatsappUrl: generateWhatsAppLink(parsed.data),
      warning: "Email service unavailable. Opening WhatsApp as a fallback.",
    })
  }
}
