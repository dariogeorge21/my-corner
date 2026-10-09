"use client"

import ContactForm, { ContactLinks } from "@/components/contact-form"

/** Home-page contact section: plain heading, quick links, one clear form. */
export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative mx-auto w-full max-w-[1400px] scroll-mt-24 px-5 py-16 sm:py-24 md:px-12 md:py-32"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-8">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-accent">Get a quote</p>
            <h2
              id="contact-heading"
              className="text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl"
            >
              Tell me about your project
            </h2>
            <p className="mt-5 max-w-lg text-lg text-foreground/75">
              Share a few details and I&apos;ll reply with a clear quote within 24 hours. No obligation.
            </p>
          </div>
          <ContactLinks />
        </div>

        <div className="rounded-2xl border border-foreground/15 bg-surface/40 p-5 backdrop-blur-sm sm:p-8">
          <ContactForm source="landing" />
        </div>
      </div>
    </section>
  )
}