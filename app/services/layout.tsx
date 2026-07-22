import type { Metadata } from "next"

// ─── Services Route Metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title:
    "Services — Web Development, Software & Hardware Support, Documentation",
  description:
    "Explore Dario George's professional services: custom website development across India, antivirus & Microsoft software support, PC hardware delivery, and professional digital documentation.",
  alternates: {
    canonical: "https://dariogeorge.in/services",
  },
  openGraph: {
    title:
      "Services | Dario George — Web Dev, Hardware Support & Documentation",
    description:
      "Custom websites, software & hardware support, and professional documentation — delivered pan-India by Dario George, freelance web developer.",
    url: "https://dariogeorge.in/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Dario George",
    description:
      "Web development, software & hardware support, and documentation services — pan-India.",
  },
}

// ─── Services Layout ──────────────────────────────────────────────────────────
export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
