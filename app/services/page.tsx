"use client"

import { useState, useRef } from "react"
import { useLenis } from "lenis/react"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Globe,
  FileText,
  Palette,
  HardDrive,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  Clock,
  ShieldCheck,
  Zap,
  Printer,
  Share2,
  Layers,
  Calendar,
} from "lucide-react"
import ContactForm, { ContactLinks } from "@/components/contact-form"
import { SERVICES, SITE, type ServiceDetail } from "@/lib/site"

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  "web-dev": <Globe size={26} className="text-accent" aria-hidden />,
  documentation: <FileText size={26} className="text-accent" aria-hidden />,
  posters: <Palette size={26} className="text-accent" aria-hidden />,
  hardware: <HardDrive size={26} className="text-accent" aria-hidden />,
}

export default function ServicesPage() {
  const [selectedService, setSelectedService] = useState<string>(SERVICES[0].shortTitle)
  const formSectionRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const scrollToQuote = (serviceTitle: string) => {
    setSelectedService(serviceTitle)
    if (lenis && formSectionRef.current) {
      lenis.scrollTo(formSectionRef.current)
    } else if (formSectionRef.current) {
      formSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const scrollToServices = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (lenis) {
      lenis.scrollTo("#service-grid")
    } else {
      const element = document.getElementById("service-grid")
      element?.scrollIntoView({ behavior: "smooth", block: "start" })
    }
    window.history.pushState(null, "", "#service-grid")
  }

  const webService = SERVICES.find((s) => s.id === "web-dev")!
  const docService = SERVICES.find((s) => s.id === "documentation")!
  const posterService = SERVICES.find((s) => s.id === "posters")!
  const hardwareService = SERVICES.find((s) => s.id === "hardware")!

  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}>
      {/* ─── Hero Section ────────────────────────────────────────────────────────── */}
      <section className="relative px-5 pt-32 pb-16 md:px-12 md:pt-40 md:pb-24 max-w-[1600px] mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-xs font-semibold tracking-wider uppercase text-accent mb-6">
            <Sparkles size={14} aria-hidden /> Transparent Rates · 4 Dedicated Services · Pan-India Delivery
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08]">
            Services crafted for <span className="text-accent">clarity</span>, speed, and real results.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-foreground/75 leading-relaxed max-w-2xl">
            From full-stack web applications and technical documentation to high-impact event posters and custom PC
            hardware — explore transparent hourly pricing and request an instant quote.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 items-center">
            <button
              type="button"
              onClick={() => scrollToQuote(SERVICES[0].shortTitle)}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-semibold text-background hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Request a Quote <ArrowRight size={18} aria-hidden />
            </button>
            <a
              href="#service-grid"
              onClick={scrollToServices}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-foreground/20 px-7 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              Browse 4 Services <ChevronDown size={16} aria-hidden />
            </a>
          </div>

          {/* Quick Rates Glance */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-foreground/10 pt-8">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">₹500<span className="text-xs font-normal text-foreground/60">/hr</span></p>
              <p className="text-xs text-foreground/60 mt-0.5">Website &amp; Web Apps</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">₹50<span className="text-xs font-normal text-foreground/60">/hr</span></p>
              <p className="text-xs text-foreground/60 mt-0.5">Technical Documentation</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">₹100<span className="text-xs font-normal text-foreground/60">/hr</span></p>
              <p className="text-xs text-foreground/60 mt-0.5">Posters for Events</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">Custom</p>
              <p className="text-xs text-foreground/60 mt-0.5">PC Hardware Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Services Overview Cards Grid ────────────────────────────────────────── */}
      <section id="service-grid" className="px-5 py-12 md:px-12 md:py-20 max-w-[1600px] mx-auto scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">[ Detailed Capabilities ]</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              What I build and deliver
            </h2>
          </div>
          <p className="text-sm text-foreground/60 max-w-md">
            Click &ldquo;Request Quote&rdquo; on any service to automatically configure your project scope and pricing parameters below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl border border-foreground/15 bg-surface/30 p-6 sm:p-8 backdrop-blur-sm transition-all hover:border-accent/40 hover:bg-surface/60 flex flex-col justify-between"
            >
              <div>
                {/* Header with icon & pricing badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="p-3 rounded-xl border border-foreground/10 bg-background/60">
                    {SERVICE_ICONS[service.id]}
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold bg-accent/15 text-accent border border-accent/20">
                      {service.rate} {service.rateUnit}
                    </span>
                    <p className="text-[11px] text-foreground/50 mt-1">{service.location}</p>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mt-5">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-foreground/75 mt-3 leading-relaxed">
                  {service.description}
                </p>

                {/* Suggested Direct Fill-in Keywords */}
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">
                    Common Scopes &amp; Keywords:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {service.suggestedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="text-xs px-2.5 py-1 rounded-md border border-foreground/10 bg-background/50 text-foreground/70"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech tags */}
                <div className="mt-4 pt-4 border-t border-foreground/10 flex flex-wrap gap-2 text-[11px] text-foreground/50 font-mono">
                  {service.tags.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="mt-8 pt-6 border-t border-foreground/10 flex items-center justify-between">
                <a href={`#section-${service.id}`} className="text-xs font-medium text-accent hover:underline">
                  View full breakdown ↓
                </a>
                <button
                  type="button"
                  onClick={() => scrollToQuote(service.shortTitle)}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-xs font-semibold text-background hover:bg-accent transition-colors"
                >
                  Request Quote <ArrowRight size={14} aria-hidden />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── In-Depth Section 01: Web Development ──────────────────────────────── */}
      <section id="section-web-dev" className="px-5 py-16 md:px-12 md:py-24 border-t border-foreground/10 max-w-[1600px] mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-bold">[ 01 · WEB DEV ]</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-3 leading-tight">
              Website &amp; Web App Development
            </h2>
            <div className="mt-4 inline-block px-3.5 py-1.5 rounded-full bg-accent/15 text-accent font-mono text-xs font-semibold">
              Rate: ₹500/hr · or fixed milestone quote
            </div>
            <p className="mt-4 text-base text-foreground/75 leading-relaxed">
              From corporate business sites to full-stack Next.js web applications. Fast load times, responsive mobile-first UX, clean codebase, and seamless database/auth architectures.
            </p>

            <button
              type="button"
              onClick={() => scrollToQuote(webService.shortTitle)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-accent transition-colors"
            >
              Configure Web Dev Quote <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">Key Deliverables &amp; Formats:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {webService.deliverables.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-foreground/10 bg-surface/30 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl border border-foreground/10 bg-background/40 mt-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-accent mb-2">Tech Stack Used</h4>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-foreground/80">
                {webService.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded bg-foreground/5 border border-foreground/10">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── In-Depth Section 02: Reports & Documentation ──────────────────────── */}
      <section id="section-documentation" className="px-5 py-16 md:px-12 md:py-24 border-t border-foreground/10 max-w-[1600px] mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-bold">[ 02 · DOCUMENTATION ]</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-3 leading-tight">
              Reports &amp; Technical Documentation
            </h2>
            <div className="mt-4 inline-block px-3.5 py-1.5 rounded-full bg-accent/15 text-accent font-mono text-xs font-semibold">
              Rate: ₹50/hr · purely digital deliverables
            </div>
            <p className="mt-4 text-base text-foreground/75 leading-relaxed">
              Clear, structured documentation for engineering projects, academic theses, software manuals, and standard operating procedures (SOPs). Delivered exclusively in clean digital formats (PDF, Markdown, DOCX, LaTeX).
            </p>

            <button
              type="button"
              onClick={() => scrollToQuote(docService.shortTitle)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-accent transition-colors"
            >
              Configure Docs Quote <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">Documentation Types:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {docService.deliverables.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-foreground/10 bg-surface/30 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-accent/20 bg-accent/5 text-xs text-foreground/80 mt-4">
              <strong>Notice:</strong> All deliverables are provided in digital formats. No handwritten deliverables are produced under this service.
            </div>
          </div>
        </div>
      </section>

      {/* ─── In-Depth Section 03: Posters for Events & Programs ─────────────────── */}
      <section id="section-posters" className="px-5 py-16 md:px-12 md:py-24 border-t border-foreground/10 bg-accent/[0.02] max-w-[1600px] mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={13} /> Featured New Service
            </div>
            <span className="block font-mono text-xs tracking-[0.3em] text-accent uppercase font-bold">[ 03 · EVENT POSTERS ]</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-3 leading-tight">
              Posters for Events, Programs &amp; Announcements
            </h2>
            <div className="mt-4 inline-block px-3.5 py-1.5 rounded-full bg-accent/15 text-accent font-mono text-xs font-semibold">
              Rate: ₹100/hr · or fixed poster/pack quotes
            </div>
            <p className="mt-4 text-base text-foreground/75 leading-relaxed">
              Visual event branding that commands attention. High-impact posters tailored for college fests, cultural nights, conferences, webinars, hackathons, and social media announcements. Delivered print-ready (300 DPI CMYK) and in social media ratios (9:16 story &amp; 1:1 post).
            </p>

            <button
              type="button"
              onClick={() => scrollToQuote(posterService.shortTitle)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-accent transition-colors"
            >
              Configure Event Poster Quote <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">Poster Categories &amp; Uses:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {posterService.deliverables.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-foreground/10 bg-surface/40 flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Formats specification card */}
            <div className="p-5 rounded-2xl border border-accent/20 bg-surface/50">
              <h4 className="text-xs font-mono uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                <Printer size={16} /> Deliverable Formats Included
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-foreground/80">
                <div className="p-2.5 rounded-lg border border-foreground/10 bg-background/60">
                  <strong>Print-Ready Flex &amp; Banners:</strong> 300 DPI CMYK format (A3, A4, Flex sizes)
                </div>
                <div className="p-2.5 rounded-lg border border-foreground/10 bg-background/60">
                  <strong>Instagram Story / WhatsApp:</strong> 9:16 vertical high-resolution digital
                </div>
                <div className="p-2.5 rounded-lg border border-foreground/10 bg-background/60">
                  <strong>Instagram / LinkedIn Feed:</strong> 1:1 square &amp; 16:9 widescreen formats
                </div>
                <div className="p-2.5 rounded-lg border border-foreground/10 bg-background/60">
                  <strong>Fast Delivery:</strong> First drafts in 24–48 hours with revisions included
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── In-Depth Section 04: PC Hardware Support ──────────────────────────── */}
      <section id="section-hardware" className="px-5 py-16 md:px-12 md:py-24 border-t border-foreground/10 max-w-[1600px] mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-bold">[ 04 · HARDWARE ]</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground mt-3 leading-tight">
              PC Hardware Support &amp; Custom Builds
            </h2>
            <div className="mt-4 inline-block px-3.5 py-1.5 rounded-full bg-accent/15 text-accent font-mono text-xs font-semibold">
              Rate: Custom Quote · On-site Delhi NCR &amp; Pan-India parts
            </div>
            <p className="mt-4 text-base text-foreground/75 leading-relaxed">
              Custom desktop assembly for content creators, developers, and gamers. Hardware diagnostics, component upgrades (NVMe SSD, RAM, GPU), thermal paste reapplications, and genuine hardware supply.
            </p>

            <button
              type="button"
              onClick={() => scrollToQuote(hardwareService.shortTitle)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-accent transition-colors"
            >
              Inquire About Hardware <ArrowRight size={16} aria-hidden />
            </button>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-2">Hardware Capabilities:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hardwareService.deliverables.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-foreground/10 bg-surface/30 flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Service Request & Quote Builder Section (Interactive Form) ─────────── */}
      <section
        ref={formSectionRef}
        id="request-quote"
        className="px-5 py-20 md:px-12 md:py-28 border-t border-foreground/10 bg-foreground/[0.02] max-w-[1600px] mx-auto scroll-mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">
                [ Request a Service ]
              </p>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                Customize your inquiry &amp; get an exact quote
              </h2>
              <p className="mt-4 text-base text-foreground/75 leading-relaxed">
                Choose any service (Web Development, Documentation, Posters, or Hardware), tap direct keywords, select output formats, and choose your preferred pricing model or enter a custom budget.
              </p>
            </div>

            <div className="rounded-2xl border border-foreground/10 bg-surface/30 p-6 flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                Direct Contact Channels
              </h3>
              <ContactLinks />
            </div>

            <div className="space-y-4 text-sm text-foreground/70">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Transparent Rates:</strong> ₹50/hr (Docs), ₹100/hr (Posters), ₹500/hr (Web), or fixed quotes.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Full Deliverables:</strong> Print-ready 300 DPI CMYK, responsive web deployments, structured documentation.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-accent shrink-0 mt-0.5" />
                <span>
                  <strong>Fast Communication:</strong> Response within 24h via email or direct WhatsApp chat.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-foreground/15 bg-surface/40 p-6 sm:p-10 backdrop-blur-md shadow-lg">
              <ContactForm source="services" defaultService={selectedService} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
