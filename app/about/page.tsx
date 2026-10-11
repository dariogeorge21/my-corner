"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  MapPin,
  Sparkles,
  Wrench,
  Globe,
  FileText,
  Palette,
  Terminal,
  CheckCircle2,
} from "lucide-react"
import { SITE } from "@/lib/site"

const TECH_CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend & UI",
    icon: <Layers size={18} className="text-accent" />,
    description: "Modern, responsive, fluid interfaces built for speed and engagement.",
    skills: ["Next.js (App Router)", "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "ShadCN UI", "HTML5 / Semantic CSS", "Web Accessibility (a11y)"],
  },
  {
    id: "backend",
    label: "Backend & Cloud",
    icon: <Globe size={18} className="text-accent" />,
    description: "Scalable server architectures, secure APIs, and real-time data persistence.",
    skills: ["Next.js Server Actions", "Node.js", "Supabase", "PostgreSQL", "REST APIs", "Authentication & RBAC", "Vercel Deployment", "Docker Basics"],
  },
  {
    id: "ai",
    label: "AI & Automation",
    icon: <Cpu size={18} className="text-accent" />,
    description: "Integrating intelligent LLM features into real-world business workflows.",
    skills: ["OpenAI API", "Google Gemini API", "Groq Cloud", "Prompt Engineering", "AI Chat Assistants", "Workflow Automation", "Python Automation"],
  },
  {
    id: "creative-hardware",
    label: "Design, Docs & Hardware",
    icon: <Wrench size={18} className="text-accent" />,
    description: "Cross-disciplinary engineering from silicon components to published documents.",
    skills: ["Technical Documentation (Markdown/LaTeX)", "Event Poster Design (CMYK/RGB)", "PC Hardware Assembly", "System Diagnostics", "Hardware Procurement", "Linux / Windows Systems"],
  },
]

const PRINCIPLES = [
  {
    num: "01",
    title: "Every feature must solve a real problem",
    desc: "Code is a liability; utility is an asset. I prioritize fewer, well-executed capabilities that deliver tangible value over superficial feature bloat.",
  },
  {
    num: "02",
    title: "Animation must serve orientation, not ego",
    desc: "Motion should give users spatial context and immediate feedback. If an animation makes a site feel slower or delays a click, it doesn't belong.",
  },
  {
    num: "03",
    title: "Transparent pricing over hidden estimates",
    desc: "Whether billing ₹50/hr for documentation, ₹100/hr for posters, or ₹500/hr for web applications, clients always know exactly what they are paying for.",
  },
  {
    num: "04",
    title: "Mobile-first is a primary product discipline",
    desc: "Smartphones are where first impressions and critical decisions happen. Every touch target, layout, and form must feel effortless on mobile.",
  },
  {
    num: "05",
    title: "Good engineering disappears into effortless usability",
    desc: "Great digital products get out of the user's way, allowing them to complete their goals with minimal friction, cognitive load, and zero confusion.",
  },
]

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState("frontend")

  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}>
      {/* ─── Hero / Bio Overview ────────────────────────────────────────────────── */}
      <section className="px-5 pt-32 pb-16 md:px-12 md:pt-40 md:pb-24 max-w-[1600px] mx-auto">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-xs font-semibold tracking-wider uppercase text-accent mb-6">
            <Sparkles size={14} aria-hidden /> Dario George · Full-Stack Developer &amp; Systems Builder
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.08]">
            Building purposeful software, clear documentation, and dependable digital solutions.
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-foreground/70">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-foreground/15 bg-surface/30">
              <MapPin size={14} className="text-accent" aria-hidden /> Delhi NCR &amp; Kerala (Bases of Operation)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-foreground/15 bg-surface/30">
              <Terminal size={14} className="text-accent" aria-hidden /> Next.js · TypeScript · Supabase
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-foreground/15 bg-surface/30">
              <CheckCircle2 size={14} className="text-accent" aria-hidden /> Serving Pan-India
            </span>
          </div>

          <p className="mt-8 text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-3xl">
            I am a freelance full-stack developer and hardware specialist. I craft custom websites, scalable web
            applications, technical reports, event posters, and build high-performance PC hardware. My focus is simple:
            clean aesthetics, transparent pricing, and zero friction.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/services#request-quote"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-semibold text-background hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Get a Quote <ArrowRight size={16} aria-hidden />
            </Link>
            <Link
              href="/#work"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-foreground/20 px-7 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              View Shipped Projects
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Story & Philosophy ─────────────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-12 md:py-24 bg-foreground/[0.02] border-y border-foreground/10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">[ Background &amp; Story ]</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
              An architectural approach to code and design.
            </h2>
            <p className="mt-5 text-base text-foreground/75 leading-relaxed">
              Operating across twin bases of operation in <strong>Delhi NCR</strong> (serving Laxmi Nagar, Gurugram, Noida, Nehru Place, and NCR) and <strong>Kerala</strong> (active in Palai, Thodupuzha, Kottayam, Muvattupuzha, Kothamangalam, and Idukki), I work with entrepreneurs, institutions, and businesses across India.
              Whether building an institutional bus pass platform, a collaborative SaaS workspace, or assembling a
              workstation, I treat every project with end-to-end craftsmanship.
            </p>
            <p className="mt-4 text-base text-foreground/75 leading-relaxed">
              I believe in direct, honest technical partnerships. No agency runarounds, no bloated retainers — just clear
              milestones, continuous delivery, and transparent hourly rates.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">[ Engineering Principles ]</p>
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.num}
                className="rounded-2xl border border-foreground/10 bg-surface/30 p-5 sm:p-6 backdrop-blur-sm"
              >
                <div className="flex items-start gap-4">
                  <span className="text-sm font-mono font-bold text-accent px-2 py-0.5 rounded bg-accent/10 shrink-0">
                    {principle.num}
                  </span>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-foreground">{principle.title}</h3>
                    <p className="text-sm text-foreground/70 mt-1 leading-relaxed">{principle.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Technical Arsenal ──────────────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-12 md:py-24 max-w-[1600px] mx-auto">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-2">[ Technical Arsenal ]</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Tools, technologies &amp; competencies
          </h2>
          <p className="mt-3 text-base text-foreground/70">
            Selected frameworks and tools leveraged to build resilient modern software.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-foreground/10 pb-4 mb-8">
          {TECH_CATEGORIES.map((cat) => {
            const active = activeTab === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  active
                    ? "bg-foreground text-background font-semibold shadow-sm"
                    : "border border-foreground/15 text-foreground/70 hover:border-foreground/30 hover:bg-foreground/5"
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* Active Tab Skills Grid */}
        {(() => {
          const current = TECH_CATEGORIES.find((c) => c.id === activeTab) || TECH_CATEGORIES[0]
          return (
            <div className="rounded-3xl border border-foreground/15 bg-surface/30 p-6 sm:p-10 backdrop-blur-sm">
              <div className="max-w-xl mb-6">
                <h3 className="text-2xl font-bold text-foreground">{current.label}</h3>
                <p className="text-sm text-foreground/70 mt-1">{current.description}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {current.skills.map((skill) => (
                  <div
                    key={skill}
                    className="p-3.5 rounded-xl border border-foreground/10 bg-background/50 flex items-center gap-2 text-sm text-foreground/85 font-medium hover:border-accent/40 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })()}
      </section>

      {/* ─── Bottom CTA Banner ──────────────────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-12 md:py-24 border-t border-foreground/10 bg-surface/20">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">[ Let&apos;s Build Together ]</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            Have a project in mind? Let&apos;s discuss the scope.
          </h2>
          <p className="text-base sm:text-lg text-foreground/75 max-w-xl">
            Whether you need a custom website, event posters, technical documentation, or hardware advice — get in touch
            for an upfront quote.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <Link
              href="/contact"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-semibold text-background hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Get a Quote <ArrowRight size={16} aria-hidden />
            </Link>
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-foreground/20 px-7 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-foreground/60 mt-4">
            {SITE.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
