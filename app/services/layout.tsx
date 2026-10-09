import type { Metadata } from "next"

// ─── Services Route Metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Services & Pricing | Dario George – Web Apps, Docs, Event Posters & PC Support",
  description:
    "Explore services by Dario George: Website & Web App development (₹500/hr), Technical Documentation & Reports (₹50/hr), Posters for Events & Programs (₹100/hr), and PC Hardware Support across Delhi & Kerala. Request an upfront quote today.",
  alternates: {
    canonical: "https://dariogeorge.in/services",
  },
  openGraph: {
    title: "Services & Pricing | Dario George – Web Dev, Docs, Posters & Hardware",
    description:
      "Transparent hourly rates: Website Development (₹500/hr), Documentation (₹50/hr), Event Posters (₹100/hr), and PC Hardware support across India.",
    url: "https://dariogeorge.in/services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services & Pricing | Dario George",
    description:
      "Custom websites, technical documentation, event posters, and PC hardware support across India.",
  },
}

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
