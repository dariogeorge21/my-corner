"use server"

import { z } from "zod"
import { headers } from "next/headers"

// ─── Validation schema (mirrors the API route) ───────────────────────────────
const ContactFormSchema = z.object({
  name: z.string().min(5).max(60),
  email: z.string().email().max(254),
  subject: z.string().min(2).max(80),
  description: z.string().min(10).max(500),
  source: z.enum(["landing", "services", "about"]).optional().default("landing"),
})

type ContactFormData = z.input<typeof ContactFormSchema>

export type ContactResponse =
  | { ok: true; channel: "email" }
  | { ok: true; channel: "whatsapp"; whatsappUrl: string; warning?: string }
  | { ok: false; error: string }

/**
 * Resolves the base URL for internal API calls.
 * Priority: NEXT_PUBLIC_BASE_URL > VERCEL_URL > request Host header > localhost:3000
 */
async function resolveBaseUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "")
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // In development, read the Host header to get the exact port Next is running on
  try {
    const headersList = await headers()
    const host = headersList.get("host") // e.g. "localhost:3001"
    if (host) {
      const protocol = host.startsWith("localhost") ? "http" : "https"
      return `${protocol}://${host}`
    }
  } catch {
    // fallback below
  }

  return "http://localhost:3000"
}

/**
 * Server action — validates, then proxies the form submission to /api/contact.
 * Business logic (Resend, rate limiting, WhatsApp fallback) lives in the API route.
 */
export async function submitContact(formData: ContactFormData): Promise<ContactResponse> {
  // Validate on the server action layer too (defence-in-depth)
  const parsed = ContactFormSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false, error: "Invalid form data. Please check your input." }
  }

  try {
    const headersList = await headers()
    const forwardedFor = headersList.get("x-forwarded-for") ?? ""
    const realIp = headersList.get("x-real-ip") ?? ""

    const baseUrl = await resolveBaseUrl()

    const res = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(forwardedFor && { "x-forwarded-for": forwardedFor }),
        ...(realIp && { "x-real-ip": realIp }),
      },
      body: JSON.stringify(parsed.data),
    })

    const json = (await res.json()) as ContactResponse

    if (res.status === 429) {
      return { ok: false, error: (json as { ok: false; error: string }).error }
    }

    return json
  } catch (err) {
    console.error("[submitContact] Network error:", err)
    return { ok: false, error: "A critical network failure occurred. Please try again." }
  }
}
