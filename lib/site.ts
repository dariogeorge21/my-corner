/**
 * Single source of truth for contact details, navigation, and service pricing.
 */
export const SITE = {
  name: "Dario George",
  email: "mail.dariogeorge@gmail.com",
  phoneDisplay: "+91 75609 77040",
  phoneHref: "tel:+917560977040",
  whatsappNumber: "917560977040",
  whatsappHref:
    "https://wa.me/917560977040?text=Hi%20Dario,%20I'd%20like%20a%20quote%20for%20a%20project!",
  telegramHref: "https://t.me/dariogeorge21",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com/in/dariogeorge21" },
    { label: "GitHub", href: "https://github.com/dariogeorge21" },
    { label: "Instagram", href: "https://instagram.com/dariogeorge21" },
  ],
} as const

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/#work" },
  { label: "Contact", href: "/contact" },
] as const

export interface ServiceDetail {
  id: string
  title: string
  shortTitle: string
  rate: string
  rateUnit: string
  description: string
  location: string
  deliverables: string[]
  tags: string[]
  suggestedKeywords: string[]
  formatOptions?: string[]
  pricingOptions: { id: string; label: string }[]
}

export const SERVICES: ServiceDetail[] = [
  {
    id: "web-dev",
    title: "Website & Web Application Development",
    shortTitle: "Website / Web App",
    rate: "₹500",
    rateUnit: "/ hr (or custom quote)",
    description:
      "High-performance business sites, lead generation pages, SaaS products, e-commerce stores, and full-stack Next.js web applications tailored to your business goals.",
    location: "Pan-India delivery",
    deliverables: [
      "Custom Next.js & React Web Applications",
      "Conversion-Driven Landing Pages",
      "Full-Stack SaaS Workspaces & Portals",
      "E-Commerce Stores with Payment Integration",
      "Personal Portfolios & Brand Websites",
      "SEO, Core Web Vitals & Speed Optimization",
    ],
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Framer Motion", "Vercel"],
    suggestedKeywords: [
      "Landing Page",
      "Full-Stack SaaS",
      "Portfolio Website",
      "E-Commerce Store",
      "Website Redesign",
      "SEO & Performance Boost",
      "Payment Gateway Integration",
      "Database & Auth Setup",
    ],
    pricingOptions: [
      { id: "hourly-500", label: "Hourly: ₹500/hr (billed on actual design & dev hours)" },
      { id: "fixed-starter", label: "Starter Web Project (< ₹15,000)" },
      { id: "fixed-growth", label: "Full Business Site (₹15,000 – ₹35,000)" },
      { id: "fixed-saas", label: "Full-Stack SaaS / Custom App (₹35,000+)" },
      { id: "custom", label: "Custom Budget / Negotiated Rate" },
    ],
  },
  {
    id: "documentation",
    title: "Reports & Technical Documentation",
    shortTitle: "Reports & Documentation",
    rate: "₹50",
    rateUnit: "/ hr",
    description:
      "Comprehensive technical reports, user manuals, API specifications, academic research papers, SOPs, and project guides in structured digital formats (PDF, Markdown, DOCX). Purely digital deliverables.",
    location: "Pan-India · Digital Deliverables Only",
    deliverables: [
      "Technical Software & Hardware Documentation",
      "Comprehensive Product User Manuals & Guides",
      "Standard Operating Procedures (SOPs)",
      "Academic & Engineering Project Reports",
      "Scientific & Research Papers (LaTeX / PDF)",
      "Developer API Documentation & Readmes",
    ],
    tags: ["Markdown", "PDF", "Technical Writing", "Academic Reports", "SOPs", "User Guides", "LaTeX"],
    suggestedKeywords: [
      "User Manual",
      "Technical Spec",
      "Academic Project Report",
      "Research Paper",
      "Standard Operating Procedure (SOP)",
      "API Documentation",
      "Software Architecture Document",
      "Formatting & Citations",
    ],
    pricingOptions: [
      { id: "hourly-50", label: "Hourly: ₹50/hr (transparent time tracking)" },
      { id: "fixed-doc-quick", label: "Quick Report / SOP (< ₹1,500)" },
      { id: "fixed-doc-full", label: "Complete Project Report (₹2,500 – ₹6,000)" },
      { id: "fixed-doc-academic", label: "Academic Thesis / Research Paper" },
      { id: "custom", label: "Custom Budget / Negotiated Rate" },
    ],
  },
  {
    id: "posters",
    title: "Posters for Events, Programs & Announcements",
    shortTitle: "Posters for Events",
    rate: "₹100",
    rateUnit: "/ hr",
    description:
      "Eye-catching visual posters and promotional creatives for college fests, cultural events, seminars, webinars, concerts, hackathons, and social media announcements. Delivered print-ready (300 DPI CMYK) and in social ratios (9:16 story & 1:1 post).",
    location: "Pan-India · High-Res Digital Delivery",
    deliverables: [
      "College Fest & Cultural Event Posters",
      "Academic Seminar & Conference Announcements",
      "Hackathon, Workshop & Tech Meetup Posters",
      "Instagram Stories (9:16) & Feed Posts (1:1)",
      "Print-Ready Large Banners & Flex Backdrops (CMYK)",
      "Event Ticket & Brochure Creatives",
    ],
    tags: ["Print-Ready CMYK 300DPI", "Social Media 1:1 & 9:16", "Event Branding", "Typography", "Fast Turnaround", "24-48h Delivery"],
    suggestedKeywords: [
      "College Fest Poster",
      "Hackathon Poster",
      "Seminar / Conference Announcement",
      "Cultural Night / Concert Poster",
      "Social Media Story (9:16)",
      "Instagram Post (1:1)",
      "Print-Ready Flex / Banner",
      "Club / Sports Tournament Announcement",
      "Event Schedule / Brochure",
    ],
    formatOptions: [
      "Print-Ready (A3 / A4 / Flex - 300 DPI CMYK)",
      "Instagram Story / WhatsApp Status (9:16)",
      "Instagram Feed / LinkedIn Post (1:1)",
      "Full Bundle (Print Poster + Story + Feed Banner)",
      "Custom Dimensions",
    ],
    pricingOptions: [
      { id: "hourly-100", label: "Hourly: ₹100/hr (billed on actual design hours)" },
      { id: "single-poster", label: "Single Event Poster (Fixed Quote: ₹500 – ₹1,500)" },
      { id: "event-pack", label: "Event Pack (Main Poster + 9:16 Story + Banner)" },
      { id: "fest-bundle", label: "College Fest Bundle (Multiple Event Posters)" },
      { id: "custom", label: "Custom Budget / Bulk Posters" },
    ],
  },
  {
    id: "hardware",
    title: "PC Hardware Support & Custom Builds",
    shortTitle: "PC Hardware Support",
    rate: "Custom Quote",
    rateUnit: "based on requirements",
    description:
      "On-site hardware troubleshooting, diagnostics, component upgrades, bespoke PC building, performance tuning, and genuine hardware supply.",
    location: "Delhi NCR on-site · Pan-India component shipping",
    deliverables: [
      "Custom PC Builds for Gaming, Workstations & AI",
      "Component Diagnostics & Hardware Repair",
      "SSD, RAM, GPU & Cooling Upgrades",
      "Thermal Optimization & Noise Tuning",
      "OS Installation, Antivirus & Driver Setup",
      "Genuine Component Procurement",
    ],
    tags: ["Custom PC Build", "Diagnostics", "SSD/RAM Upgrade", "Thermals & Tuning", "Component Sourcing", "Delhi NCR On-Site"],
    suggestedKeywords: [
      "Custom PC Build",
      "Diagnostic & Repair",
      "SSD / RAM Upgrade",
      "Workstation for Video/3D",
      "Gaming PC Assembly",
      "Office Computer Setup",
      "Thermal Paste & Cleaning",
      "Component Sourcing",
    ],
    pricingOptions: [
      { id: "consult", label: "Build Consultation & Part Sourcing" },
      { id: "onsite-repair", label: "On-site Diagnostics / Repair (Delhi NCR)" },
      { id: "full-assembly", label: "Full System Assembly & Stress Testing" },
      { id: "component-upgrade", label: "Storage / Memory / GPU Upgrade" },
      { id: "custom", label: "Custom Hardware Request" },
    ],
  },
] as const

export const SERVICE_OPTIONS = SERVICES.map((s) => s.shortTitle)

export const TIMELINE_OPTIONS = [
  "Urgent (< 3 days)",
  "Within 1–2 weeks",
  "Within 1 month",
  "Flexible timeline",
] as const
