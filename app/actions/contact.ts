"use server"

import { z } from "zod"

// Validation schema
const ContactFormSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email(),
  subject: z.string().min(4).max(30),
  description: z.string().min(10).max(100),
  turnstileToken: z.string().min(1, "Turnstile verification required"),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

/**
 * Verify Turnstile token with Cloudflare
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY

  if (!secretKey) {
    console.error("Turnstile secret key not configured")
    return false
  }

  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true && data.error_codes?.length === 0
  } catch (error) {
    console.error("Turnstile verification failed:", error)
    return false
  }
}

/**
 * Generate WhatsApp message and redirect URL
 * Phone number should be in format: +1234567890 (country code + number without +)
 */
function generateWhatsAppLink(formData: ContactFormData): string {
  const whatsappNumber = "7560977040" // WhatsApp number without +
  const message = encodeURIComponent(
    `Hello! 👋\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nSubject: ${formData.subject}\n\nMessage: ${formData.description}`
  )
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

/**
 * Main contact submission handler
 */
export async function submitContact(
  formData: ContactFormData & { turnstileToken: string }
): Promise<{ ok: boolean; error?: string; whatsappUrl?: string }> {
  try {
    // Validate form data
    const validatedData = ContactFormSchema.parse(formData)

    // Verify Turnstile token
    const isValidTurnstile = await verifyTurnstile(validatedData.turnstileToken)
    if (!isValidTurnstile) {
      return {
        ok: false,
        error: "Verification failed. Please try again.",
      }
    }

    // Generate WhatsApp link
    const whatsappLink = generateWhatsAppLink(validatedData)

    // Log submission (optional - for analytics/monitoring)
    console.log(`Contact form submission from ${validatedData.email}`)

    return {
      ok: true,
      whatsappUrl: whatsappLink,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        ok: false,
        error: "Invalid form data. Please check your input.",
      }
    }

    console.error("Contact submission error:", error)
    return {
      ok: false,
      error: "An error occurred. Please try again later.",
    }
  }
}
