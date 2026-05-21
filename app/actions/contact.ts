"use server"

import { z } from "zod"

// Validation schema
const ContactFormSchema = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email(),
  subject: z.string().min(4).max(30),
  description: z.string().min(10).max(100),
})

type ContactFormData = z.infer<typeof ContactFormSchema>

/**
 * 
 * Generate WhatsApp message and redirect URL
 * Phone number should be in format: +1234567890 (country code + number without +)
 */
function generateWhatsAppLink(formData: ContactFormData): string {
  const whatsappNumber = "7560977040" // WhatsApp number without +
  const message = encodeURIComponent(
    `🙋 *Hey, I'm ${formData.name}!*\n\n📧 *Email:* ${formData.email}\n\n💬 *Subject:* ${formData.subject}\n\n📄 *Details:*\n${formData.description}\n\n`
  )
  return `https://wa.me/${whatsappNumber}?text=${message}`
}

/**
 * Main contact submission handler
 */
export async function submitContact(
  formData: ContactFormData
): Promise<{ ok: boolean; error?: string; whatsappUrl?: string }> {
  try {
    // Validate form data
    const validatedData = ContactFormSchema.parse(formData)

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
