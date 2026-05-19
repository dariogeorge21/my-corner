"use server"

import { Resend } from "resend"

// Type matches the frontend state exactly, plus the Turnstile token
export type ContactSubmission = {
  name: string
  email: string
  subject: string
  description: string
  turnstileToken?: string // Optional in dev, enforced in prod if secret is set
}

type TurnstileVerifyResponse = {
  success: boolean
  "error-codes"?: string[]
}

// Security: XSS Sanitization helper
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

export async function submitContact(input: ContactSubmission): Promise<
  | { ok: true }
  | { ok: false; error: string }
> {
  // 1. Environment Configuration
  const resendApiKey = process.env.RESEND_API_KEY
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY

  if (!resendApiKey) {
    return { ok: false, error: "System Configuration Error: Missing Mailer API Key." }
  }

  // 2. Input Extraction & Trimming
  const name = input.name?.trim() ?? ""
  const email = input.email?.trim() ?? ""
  const subject = input.subject?.trim() ?? ""
  const description = input.description?.trim() ?? ""
  const turnstileToken = input.turnstileToken?.trim() ?? ""

  // 3. Strict Server-Side Validation (Double-checking frontend)
  if (!name || name.length < 5) return { ok: false, error: "Name must be at least 5 characters." }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "Invalid email address format." }
  if (!subject || subject.length < 4) return { ok: false, error: "Subject must be at least 4 characters." }
  if (!description || description.length < 10) return { ok: false, error: "Description must be at least 10 characters." }

  // 4. Cloudflare Turnstile Verification (If configured)
  if (turnstileSecret && turnstileToken) {
    const verifyBody = new URLSearchParams({
      secret: turnstileSecret,
      response: turnstileToken,
    })

    try {
      const verifyRes = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: verifyBody.toString(),
        cache: "no-store",
      })

      if (!verifyRes.ok) throw new Error("Network Error")
      
      const verifyJson = (await verifyRes.json()) as TurnstileVerifyResponse
      if (!verifyJson.success) {
        return { ok: false, error: "Security check failed. Please try again." }
      }
    } catch (error) {
      return { ok: false, error: "Captcha verification failed (network anomaly)." }
    }
  } else if (turnstileSecret && !turnstileToken) {
     return { ok: false, error: "Security token missing." }
  }

  // 5. Initialize Mailer
  const to = process.env.CONTACT_TO_EMAIL ?? "edu.dariogeorge21@gmail.com"
  const from = process.env.CONTACT_FROM_EMAIL ?? "Dario's Corner <onboarding@resend.dev>"
  const resend = new Resend(resendApiKey)

  try {
    // 6. Transmit Email with Premium HTML Template
    await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `[Portfolio Inquiry] ${escapeHtml(subject)}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${description}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #eaeaea; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #000; margin-top: 0; margin-bottom: 24px; font-weight: 600; font-size: 20px; letter-spacing: -0.02em; border-bottom: 1px solid #eaeaea; padding-bottom: 16px;">
            Incoming Transmission
          </h2>
          
          <div style="margin-bottom: 20px;">
            <p style="margin: 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Sender Profile</p>
            <p style="margin: 4px 0 0 0; font-size: 15px;">
              <strong>${escapeHtml(name)}</strong> &middot; <a href="mailto:${escapeHtml(email)}" style="color: #0066cc; text-decoration: none;">${escapeHtml(email)}</a>
            </p>
          </div>

          <div style="margin-bottom: 24px;">
            <p style="margin: 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Subject Protocol</p>
            <p style="margin: 4px 0 0 0; font-size: 15px; font-weight: 500;">
              ${escapeHtml(subject)}
            </p>
          </div>
          
          <div style="background-color: #fafafa; padding: 24px; border-radius: 8px; margin-top: 12px; border: 1px solid #f0f0f0;">
            <p style="margin: 0 0 12px 0; color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Message Data</p>
            <p style="margin: 0; white-space: pre-wrap; color: #333; font-size: 14px; line-height: 1.7;">${escapeHtml(description)}</p>
          </div>
          
          <div style="margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #eaeaea; padding-top: 16px; text-align: center; font-family: monospace;">
            Securely routed via Dario's Corner System Architecture.
          </div>
        </div>
      `,
    })

    return { ok: true }
  } catch (error) {
    console.error("Resend API Error:", error)
    return { ok: false, error: "Transmission failed. Secure connection dropped." }
  }
}