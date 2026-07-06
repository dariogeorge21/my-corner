"use server"

import { z } from "zod"
import { headers } from "next/headers"

// Validation schema
const ContactFormSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email(),
  subject: z.string().min(4).max(30),
  description: z.string().min(10).max(100),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

export type ContactResponse =
  | { ok: true; channel: "email" }
  | { ok: true; channel: "whatsapp"; whatsappUrl: string; warning?: string }
  | { ok: false; error: string }

/**
 * Server action — proxies the form submission to the /api/contact route handler.
 * Business logic (Resend + rate limiting + WhatsApp fallback) lives in the API layer.
 */
export async function submitContact(formData: ContactFormData): Promise<ContactResponse> {
  // Validate on the server action layer too (defence-in-depth)
  const parsed = ContactFormSchema.safeParse(formData)
  if (!parsed.success) {
    return { ok: false, error: "Invalid form data. Please check your input." }
  }

  try {
    // Forward the caller's IP so the API route can rate-limit correctly
    const headersList = await headers()
    const forwardedFor = headersList.get("x-forwarded-for") ?? ""
    const realIp = headersList.get("x-real-ip") ?? ""

    // Determine the base URL for the internal fetch
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

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
    return { ok: false, error: "A critical network failure occurred." }
  }
}
