import { NextRequest } from "next/server"
import { Resend } from "resend"
import { z } from "zod"

// ---------------------------------------------------------------------------
// Validation schema — mirrors the client-side rules
// description is now 500 chars max to match the services form
// ---------------------------------------------------------------------------
const ContactFormSchema = z.object({
  name: z.string().min(5).max(60),
  email: z.string().email().max(254),
  subject: z.string().min(2).max(80),
  description: z.string().min(10).max(500),
  source: z.enum(["landing", "services", "about"]).optional().default("landing"),
})

// ---------------------------------------------------------------------------
// In-memory rate limiter — 3 requests per minute per IP
// NOTE: process-local. For multi-instance / edge use Upstash Redis instead.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000 // 1 minute
const RATE_LIMIT_MAX = 3

const rateLimitStore = new Map<string, { count: number; windowStart: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, { count: 1, windowStart: now })
    return false
  }

  if (record.count >= RATE_LIMIT_MAX) return true
  record.count++
  return false
}

// ---------------------------------------------------------------------------
// WhatsApp fallback URL generator
// ---------------------------------------------------------------------------
function generateWhatsAppLink(data: z.infer<typeof ContactFormSchema>): string {
  const whatsappNumber = "917560977040" // include country code
  const message = encodeURIComponent(
    `🙋 *New Inquiry from ${data.source === "services" ? "Services Page" : "My Corner"}*\n\n` +
    `👤 *Name:* ${data.name}\n` +
    `📧 *Email:* ${data.email}\n` +
    `🏷️ *Service:* ${data.subject}\n\n` +
    `📄 *Details:*\n${data.description}\n`
  )
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

// ---------------------------------------------------------------------------
// HTML email builder
// ---------------------------------------------------------------------------
function buildEmailHtml(data: z.infer<typeof ContactFormSchema>): string {
  const sourceBadge =
    data.source === "services"
      ? `<span style="background:#7c3aed;color:#fff;padding:2px 10px;border-radius:999px;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Services Page</span>`
      : data.source === "about"
        ? `<span style="background:#059669;color:#fff;padding:2px 10px;border-radius:999px;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">About Page</span>`
        : `<span style="background:#0284c7;color:#fff;padding:2px 10px;border-radius:999px;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">Contact Form</span>`

  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;background:#0d0d0d;border-radius:12px;overflow:hidden;border:1px solid #222;">
      <!-- Header -->
      <div style="padding:32px 40px 24px;background:linear-gradient(135deg,#1a1a1a 0%,#0d0d0d 100%);border-bottom:1px solid #222;">
        <p style="margin:0 0 12px;font-size:12px;color:#888;letter-spacing:2px;text-transform:uppercase;">My Corner · dariogeorge.in</p>
        <h1 style="margin:0 0 12px;font-size:26px;font-weight:800;color:#fff;letter-spacing:-0.5px;">New Service Inquiry</h1>
        ${sourceBadge}
      </div>

      <!-- Body -->
      <div style="padding:32px 40px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#888;width:110px;vertical-align:top;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Name</td>
            <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#fff;font-size:15px;font-weight:500;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#888;vertical-align:top;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Email</td>
            <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;font-size:15px;"><a href="mailto:${data.email}" style="color:#a78bfa;text-decoration:none;font-weight:500;">${data.email}</a></td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#888;vertical-align:top;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">Service</td>
            <td style="padding:14px 0;border-bottom:1px solid #1e1e1e;color:#fff;font-size:15px;font-weight:500;">${data.subject}</td>
          </tr>
          <tr>
            <td style="padding:14px 0;color:#888;vertical-align:top;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;padding-top:18px;">Details</td>
            <td style="padding:14px 0;padding-top:18px;color:#ccc;font-size:15px;line-height:1.7;white-space:pre-wrap;">${data.description}</td>
          </tr>
        </table>
      </div>

      <!-- Footer -->
      <div style="padding:20px 40px;border-top:1px solid #1e1e1e;background:#0a0a0a;">
        <p style="margin:0;color:#444;font-size:11px;letter-spacing:0.5px;">Sent via dariogeorge.in · Reply directly to this email to respond to ${data.name}.</p>
      </div>
    </div>
  `
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
    console.error("[contact/route] Validation error:", parsed.error.flatten())
    return Response.json(
      { ok: false, error: "Invalid form data. Please check your input." },
      { status: 422 }
    )
  }

  const { name, email, subject } = parsed.data

  // --- Send via Resend (primary) ---
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
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
      from: "My Corner <noreply@dariogeorge.in>",
      to: "dariogeorge21@gmail.com",
      replyTo: email,
      subject: `[My Corner] New Inquiry: ${subject}`,
      html: buildEmailHtml(parsed.data),
    })

    if (error) {
      console.error("[contact/route] Resend error:", error)
      return Response.json({
        ok: true,
        channel: "whatsapp",
        whatsappUrl: generateWhatsAppLink(parsed.data),
        warning: "Email delivery failed. Opening WhatsApp as a fallback.",
      })
    }

    console.log(`[contact/route] Email sent — from: ${email}, subject: "${subject}"`)
    return Response.json({ ok: true, channel: "email" })
  } catch (err) {
    console.error("[contact/route] Unexpected error:", err)
    return Response.json({
      ok: true,
      channel: "whatsapp",
      whatsappUrl: generateWhatsAppLink(parsed.data),
      warning: "Email service unavailable. Opening WhatsApp as a fallback.",
    })
  }
}
