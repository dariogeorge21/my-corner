"use client"

import { CheckCircle2, Clock, MapPin, ShieldCheck, Sparkles } from "lucide-react"
import ContactForm, { ContactLinks } from "@/components/contact-form"
import { SERVICES, SITE } from "@/lib/site"

export default function ContactClient() {
  return (
    <div className="relative w-full overflow-hidden" style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}>
      <section
        aria-labelledby="contact-page-heading"
        className="mx-auto w-full max-w-[1600px] px-5 pb-20 pt-32 md:px-12 md:pt-40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Context, Rates & Direct Channels */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/20 bg-accent/5 text-xs font-semibold tracking-wider uppercase text-accent mb-4">
                <Sparkles size={14} aria-hidden /> Direct Collaboration &amp; Upfront Quotes
              </div>
              <h1
                id="contact-page-heading"
                className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight tracking-tight text-foreground"
              >
                Let&apos;s talk about your project.
              </h1>
              <p className="mt-4 text-base sm:text-lg text-foreground/75 leading-relaxed">
                Send your requirements, choose a service and pricing model, or enter a custom budget. I reply with a
                concrete proposal within 24 hours.
              </p>
            </div>

            {/* Quick Rates Glance */}
            <div className="rounded-2xl border border-foreground/10 bg-surface/30 p-5 backdrop-blur-sm space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">[ Active Standard Rates ]</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {SERVICES.map((s) => (
                  <div key={s.id} className="p-2.5 rounded-lg border border-foreground/10 bg-background/50 flex flex-col">
                    <span className="font-semibold text-foreground truncate">{s.shortTitle}</span>
                    <span className="font-mono text-accent font-medium mt-0.5">{s.rate} {s.rateUnit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact Links */}
            <div className="rounded-2xl border border-foreground/10 bg-surface/30 p-5 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">Instant Reach</p>
              <ContactLinks />
            </div>

            {/* Guarantees */}
            <div className="space-y-3 text-xs sm:text-sm text-foreground/70">
              <div className="flex items-center gap-2.5">
                <Clock size={16} className="text-accent shrink-0" />
                <span>Response within 24 hours guaranteed</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-accent shrink-0" />
                <span>No spam, no sales pressure — direct discussion with developer</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-accent shrink-0" />
                <span>Delhi NCR (on-site hardware) &amp; Kerala · Pan-India remote delivery</span>
              </div>
            </div>

            {/* Socials */}
            <div className="pt-4 border-t border-foreground/10 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground/60">
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

          {/* Right Column: Supercharged Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-foreground/15 bg-surface/40 p-6 sm:p-10 backdrop-blur-md shadow-xl">
              <ContactForm source="landing" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
