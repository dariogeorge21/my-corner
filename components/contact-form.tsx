"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLenis } from "lenis/react"
import { ArrowRight, CheckCircle2, DollarSign, Mail, MessageCircle, Palette, Phone, Sparkles, Tag } from "lucide-react"
import { submitContact } from "@/app/actions/contact"
import { SERVICES, SERVICE_OPTIONS, SITE, TIMELINE_OPTIONS, type ServiceDetail } from "@/lib/site"

type Values = {
  name: string
  email: string
  phone: string
  subject: string
  selectedFormat: string
  selectedKeywords: string[]
  pricingModel: string
  customBudget: string
  timeline: string
  description: string
}

type Errors = Partial<Record<"name" | "email" | "description" | "customBudget", string>>

const EMPTY: Values = {
  name: "",
  email: "",
  phone: "",
  subject: SERVICE_OPTIONS[0],
  selectedFormat: "",
  selectedKeywords: [],
  pricingModel: SERVICES[0]?.pricingOptions[0]?.label || "Hourly Rate",
  customBudget: "",
  timeline: TIMELINE_OPTIONS[1],
  description: "",
}

const DRAFT_KEY = "contact-draft-v3"
const MAX_MESSAGE = 1000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_OR_TAG_RE = /(https?:\/\/[^\s]+|<[^>]*>)/i

const SENDING_STEPS = ["Packing your inquiry…", "Connecting to server…", "Almost there…"]

function validate(v: Values): Errors {
  const e: Errors = {}
  const name = v.name.trim()
  if (name.length < 2) {
    e.name = name ? "Please enter at least 2 characters." : "Please tell me your name."
  } else if (name.length > 60) {
    e.name = "Name is too long — 60 characters max."
  } else if (URL_OR_TAG_RE.test(name)) {
    e.name = "Please enter your name without links or HTML."
  }

  if (!v.email.trim()) {
    e.email = "Please enter your email so I can reply."
  } else if (!EMAIL_RE.test(v.email.trim())) {
    e.email = "That doesn't look like an email — try name@example.com."
  }

  const msg = v.description.trim()
  if (msg.length < 10 && v.selectedKeywords.length === 0 && !v.selectedFormat) {
    e.description = `Tell me a bit more about your project — ${10 - msg.length} more character${10 - msg.length === 1 ? "" : "s"} needed.`
  } else if (msg.length > MAX_MESSAGE) {
    e.description = `Message is ${msg.length - MAX_MESSAGE} characters too long.`
  } else if (URL_OR_TAG_RE.test(msg)) {
    e.description = "Please remove links or HTML — mention them in a reply after I respond."
  }

  if (v.pricingModel.toLowerCase().includes("custom") && !v.customBudget.trim()) {
    e.customBudget = "Please specify your estimated budget or rate (e.g. ₹8,000 or ₹350/hr)."
  }

  return e
}

function Field({
  label,
  optional,
  error,
  hint,
  children,
  htmlFor,
  errorId,
}: {
  label: string
  optional?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  htmlFor: string
  errorId: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-foreground">
        {label} {optional && <span className="font-normal text-foreground/60">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-foreground/60">{hint}</p>
      ) : null}
    </div>
  )
}

const inputClass = (invalid: boolean) =>
  `w-full rounded-lg border bg-background/60 px-4 py-3 text-base text-foreground placeholder:text-foreground/40 outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/30 ${
    invalid ? "border-red-500" : "border-foreground/20"
  }`

interface ContactFormProps {
  source?: "landing" | "services" | "about"
  defaultService?: string
  defaultKeyword?: string
  defaultFormat?: string
  onSubmitted?: () => void
}

export default function ContactForm({
  source = "landing",
  defaultService,
  defaultKeyword,
  defaultFormat,
  onSubmitted,
}: ContactFormProps) {
  const uid = useId()
  const [values, setValues] = useState<Values>(() => {
    const init = { ...EMPTY }
    if (defaultService) {
      init.subject = defaultService
      const matched = SERVICES.find((s) => s.shortTitle === defaultService)
      if (matched) {
        init.pricingModel = matched.pricingOptions[0]?.label || init.pricingModel
        if (matched.formatOptions && matched.formatOptions[0]) {
          init.selectedFormat = defaultFormat || matched.formatOptions[0]
        }
      }
    }
    if (defaultKeyword) init.selectedKeywords = [defaultKeyword]
    return init
  })
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [status, setStatus] = useState<"idle" | "success" | "whatsapp" | "error">("idle")
  const [serverError, setServerError] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const [restored, setRestored] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  // Scroll to the contact section starting on successful submission
  useEffect(() => {
    if (status === "success" || status === "whatsapp") {
      const timer = setTimeout(() => {
        const targetSection =
          (source === "services"
            ? document.getElementById("request-quote") || document.getElementById("contact")
            : document.getElementById("contact") || document.getElementById("request-quote")) ||
          containerRef.current?.closest("section")

        if (targetSection) {
          if (lenis) {
            const selector = targetSection.id ? `#${targetSection.id}` : targetSection
            lenis.scrollTo(selector)
          } else {
            targetSection.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }
      }, 60)

      return () => clearTimeout(timer)
    }
  }, [status, lenis, source])

  // Current service detail
  const currentServiceDetail: ServiceDetail | undefined = useMemo(() => {
    return SERVICES.find((s) => s.shortTitle === values.subject) || SERVICES[0]
  }, [values.subject])

  // Sync when defaultService prop changes dynamically from parent page
  useEffect(() => {
    if (defaultService && defaultService !== values.subject) {
      handleServiceChange(defaultService)
    }
  }, [defaultService])

  // Restore draft from sessionStorage
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Values>
        setValues((v) => ({ ...v, ...parsed }))
        if (parsed.name || parsed.email || parsed.description) setRestored(true)
      }
    } catch {}
  }, [])

  // Persist draft to sessionStorage
  useEffect(() => {
    if (status === "success" || status === "whatsapp") return
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values))
    } catch {}
  }, [values, status])

  // Step indicator ticker during submit
  useEffect(() => {
    if (!submitting) {
      setStepIndex(0)
      return
    }
    const t = setInterval(() => setStepIndex((i) => Math.min(i + 1, SENDING_STEPS.length - 1)), 1300)
    return () => clearInterval(t)
  }, [submitting])

  const errors = validate(values)

  const toggleKeyword = (kw: string) => {
    setValues((prev) => {
      const exists = prev.selectedKeywords.includes(kw)
      const next = exists
        ? prev.selectedKeywords.filter((k) => k !== kw)
        : [...prev.selectedKeywords, kw]
      return { ...prev, selectedKeywords: next }
    })
  }

  const handleServiceChange = (serviceTitle: string) => {
    const matched = SERVICES.find((s) => s.shortTitle === serviceTitle)
    setValues((prev) => ({
      ...prev,
      subject: serviceTitle,
      selectedFormat: matched?.formatOptions ? matched.formatOptions[0] : "",
      selectedKeywords: [],
      pricingModel: matched?.pricingOptions[0]?.label || "Hourly Rate",
      customBudget: "",
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setTouched({ name: true, email: true, description: true, customBudget: true })

    const first = (Object.keys(errors) as (keyof Errors)[])[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }

    setSubmitting(true)
    setStatus("idle")
    setServerError("")

    // Assemble structured description containing keywords, format & pricing
    const detailsLines: string[] = []
    if (values.selectedFormat) {
      detailsLines.push(`Format / Deliverable: ${values.selectedFormat}`)
    }
    if (values.selectedKeywords.length > 0) {
      detailsLines.push(`Scope / Keywords: ${values.selectedKeywords.join(", ")}`)
    }
    const pricingStr = values.pricingModel.toLowerCase().includes("custom")
      ? `Custom Budget: ${values.customBudget}`
      : `Selected Pricing: ${values.pricingModel}`
    detailsLines.push(pricingStr)
    detailsLines.push(`Timeline: ${values.timeline}`)
    if (values.description.trim()) {
      detailsLines.push(`Notes: ${values.description.trim()}`)
    } else {
      detailsLines.push(`Requirements based on selected keywords.`)
    }

    const compiledDescription = detailsLines.join("\n")

    try {
      const res = await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim() || undefined,
        subject: values.subject,
        description: compiledDescription,
        source,
      })

      if (!res.ok) {
        setStatus("error")
        setServerError(
          res.error && res.error !== "Failed to send message"
            ? res.error
            : "I couldn't send your message right now. Your draft is saved — please try again or contact me directly via WhatsApp or email."
        )
        return
      }

      sessionStorage.removeItem(DRAFT_KEY)
      setValues(EMPTY)
      setTouched({})
      if (res.channel === "whatsapp" && res.whatsappUrl) {
        setWhatsappUrl(res.whatsappUrl)
        setStatus("whatsapp")
      } else {
        setStatus("success")
      }
      onSubmitted?.()
    } catch {
      setStatus("error")
      setServerError(
        "Couldn't reach the server — check your internet connection and try again. Your draft is saved."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full">
      {status === "success" || status === "whatsapp" ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-green-500/30 bg-green-500/10 p-8 text-center"
        >
          <CheckCircle2 className="mx-auto mb-4 text-green-600 dark:text-green-400" size={44} aria-hidden />
          <h3 className="text-2xl font-semibold text-foreground">
            {status === "success" ? "Inquiry Sent Successfully!" : "Almost Done — One More Tap"}
          </h3>
          <p className="mt-2 text-foreground/80 max-w-md mx-auto">
            {status === "success"
              ? "I've received your project details, formats, and pricing parameters. I will respond to your email within 24 hours with a comprehensive quote."
              : "Email gateway is temporarily busy. Tap below to transmit your project scope directly to my WhatsApp."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            {status === "whatsapp" && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-foreground px-6 font-semibold text-background"
              >
                <MessageCircle size={18} aria-hidden /> Continue on WhatsApp
              </a>
            )}
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-foreground/30 px-6 font-medium text-foreground hover:bg-foreground/5 transition-colors"
            >
              Submit Another Request
            </button>
          </div>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={submitting} className="flex flex-col gap-6">
      {restored && (
        <p className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-foreground/80 flex items-center justify-between" role="status">
          <span>Welcome back — restored your unsent draft.</span>
          <button
            type="button"
            className="text-xs font-semibold underline underline-offset-2 hover:text-accent ml-2"
            onClick={() => {
              setValues(EMPTY)
              setTouched({})
              setRestored(false)
              sessionStorage.removeItem(DRAFT_KEY)
            }}
          >
            Clear draft
          </button>
        </p>
      )}

      {/* 1. Service Selection */}
      <div className="flex flex-col gap-2">
        <label htmlFor={`${uid}-service-select`} className="text-sm font-semibold text-foreground flex items-center gap-2">
          <span>1. Select Service</span>
          <span className="text-xs font-normal text-foreground/60">(Upfront rates specified)</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {SERVICES.map((service) => {
            const isSelected = values.subject === service.shortTitle
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => handleServiceChange(service.shortTitle)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-sm ring-1 ring-accent"
                    : "border-foreground/15 bg-background/40 hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">{service.shortTitle}</span>
                  <span className="text-xs font-mono font-medium text-accent px-2 py-0.5 rounded-full bg-accent/10">
                    {service.rate} {service.rateUnit}
                  </span>
                </div>
                <p className="text-xs text-foreground/60 mt-1 line-clamp-1">{service.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Format / Deliverable Options (Especially for Posters!) */}
      {currentServiceDetail && currentServiceDetail.formatOptions && currentServiceDetail.formatOptions.length > 0 && (
        <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-foreground/15 bg-surface/30">
          <label className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <Palette size={14} aria-hidden /> Required Format &amp; Output Ratio:
          </label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {currentServiceDetail.formatOptions.map((fmt) => {
              const active = values.selectedFormat === fmt
              return (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, selectedFormat: fmt }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    active
                      ? "border-accent bg-accent text-white font-semibold shadow-sm"
                      : "border-foreground/15 text-foreground/80 hover:border-foreground/40 bg-background/60"
                  }`}
                >
                  {fmt}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 3. Direct Fill-in Keywords (Quick Fill Chips) */}
      {currentServiceDetail && currentServiceDetail.suggestedKeywords.length > 0 && (
        <div className="flex flex-col gap-2 p-3.5 rounded-xl border border-foreground/10 bg-surface/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Sparkles size={14} aria-hidden /> Direct Fill-in Keywords
            </span>
            <span className="text-[11px] text-foreground/50">Tap to include in project scope</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-1">
            {currentServiceDetail.suggestedKeywords.map((kw) => {
              const active = values.selectedKeywords.includes(kw)
              return (
                <button
                  key={kw}
                  type="button"
                  onClick={() => toggleKeyword(kw)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    active
                      ? "bg-accent text-white shadow-sm ring-2 ring-accent/30"
                      : "bg-background/80 text-foreground/80 border border-foreground/15 hover:border-foreground/40 hover:bg-background"
                  }`}
                >
                  <Tag size={12} className={active ? "text-white" : "text-foreground/40"} aria-hidden />
                  {kw}
                  {active && <span className="text-xs">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* 4. Pricing / Budget Parameter (Selectable + Custom entry) */}
      {currentServiceDetail && (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <DollarSign size={16} className="text-accent" aria-hidden />
            <span>2. Budget or Pricing Parameter</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentServiceDetail.pricingOptions.map((opt) => {
              const isSelected = values.pricingModel === opt.label
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setValues((v) => ({ ...v, pricingModel: opt.label }))}
                  className={`px-3.5 py-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                    isSelected
                      ? "border-accent bg-accent/10 text-foreground font-semibold"
                      : "border-foreground/15 bg-background/50 text-foreground/75 hover:border-foreground/30"
                  }`}
                >
                  {opt.label}
                </button>
              )
            })}
          </div>

          {/* Custom Budget Entry if Custom selected */}
          {values.pricingModel.toLowerCase().includes("custom") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor={`${uid}-custom-budget`} className="text-xs font-medium text-foreground">
                  Specify Your Custom Budget or Target Hourly Rate:
                </label>
                <input
                  id={`${uid}-custom-budget`}
                  name="customBudget"
                  type="text"
                  placeholder="e.g. ₹8,000 fixed, or ₹100/hr, or bulk pack quote"
                  value={values.customBudget}
                  onChange={(e) => setValues((v) => ({ ...v, customBudget: e.target.value }))}
                  className={inputClass(!!touched.customBudget && !!errors.customBudget)}
                />
                {touched.customBudget && errors.customBudget && (
                  <p role="alert" className="text-xs text-red-500">{errors.customBudget}</p>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 5. Timeline Selection */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-foreground/80">Estimated Delivery / Urgency:</label>
        <div className="flex flex-wrap gap-2">
          {TIMELINE_OPTIONS.map((timeOpt) => {
            const active = values.timeline === timeOpt
            return (
              <button
                key={timeOpt}
                type="button"
                onClick={() => setValues((v) => ({ ...v, timeline: timeOpt }))}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                  active
                    ? "border-accent bg-accent/10 text-accent font-semibold"
                    : "border-foreground/15 text-foreground/70 hover:border-foreground/30 bg-background/40"
                }`}
              >
                {timeOpt}
              </button>
            )
          })}
        </div>
      </div>

      {/* 6. Contact Details (Name, Email, Phone) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Your Name" error={touched.name ? errors.name : undefined} htmlFor={`${uid}-name`} errorId={`${uid}-name-err`}>
          <input
            id={`${uid}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={60}
            placeholder="e.g. Aryan Nair"
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!(touched.name && errors.name)}
            className={inputClass(!!(touched.name && errors.name))}
            disabled={submitting}
          />
        </Field>

        <Field label="Email Address" error={touched.email ? errors.email : undefined} htmlFor={`${uid}-email`} errorId={`${uid}-email-err`}>
          <input
            id={`${uid}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!(touched.email && errors.email)}
            className={inputClass(!!(touched.email && errors.email))}
            disabled={submitting}
          />
        </Field>
      </div>

      <Field label="Phone / WhatsApp Number" optional htmlFor={`${uid}-phone`} errorId={`${uid}-phone-err`}>
        <input
          id={`${uid}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="e.g. +91 98765 43210"
          value={values.phone}
          onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
          className={inputClass(false)}
          disabled={submitting}
        />
      </Field>

      {/* 7. Description / Project Notes */}
      <Field
        label="Project Requirements & Details"
        error={touched.description ? errors.description : undefined}
        hint={`${values.description.trim().length}/${MAX_MESSAGE} characters · selected format & keywords automatically append to scope`}
        htmlFor={`${uid}-desc`}
        errorId={`${uid}-desc-err`}
      >
        <textarea
          id={`${uid}-desc`}
          name="description"
          rows={4}
          placeholder={`Describe your specific goals, event date, themes, or design preferences...`}
          value={values.description}
          onChange={(e) => setValues((v) => ({ ...v, description: e.target.value }))}
          onBlur={() => setTouched((t) => ({ ...t, description: true }))}
          aria-invalid={!!(touched.description && errors.description)}
          className={`${inputClass(!!(touched.description && errors.description))} resize-y min-h-[110px]`}
          disabled={submitting}
        />
      </Field>

      {/* Server Error Message */}
      <AnimatePresence>
        {status === "error" && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300"
          >
            {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Always-visible Send Button with Stunning Sending State */}
      <button
        type="submit"
        disabled={submitting}
        className={`relative flex min-h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-foreground px-8 text-base font-semibold text-background transition-all active:scale-[0.99] disabled:cursor-wait ${
          submitting ? "send-btn-loading" : "hover:opacity-90"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {submitting ? (
            <motion.span
              key="sending"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-3"
            >
              <span className="send-orbit" aria-hidden />
              <span aria-live="polite">{SENDING_STEPS[stepIndex]}</span>
              <span className="flex items-center gap-1 opacity-70" aria-hidden>
                <span className="send-trail-dot" style={{ animationDelay: "0s" }} />
                <span className="send-trail-dot" style={{ animationDelay: "0.15s" }} />
                <span className="send-trail-dot" style={{ animationDelay: "0.3s" }} />
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex items-center gap-2"
            >
              Request Quote &amp; Send Inquiry <ArrowRight size={18} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
        {submitting && (
          <motion.span
            aria-hidden
            className="absolute bottom-0 left-0 h-[3px] bg-accent"
            initial={{ width: "5%" }}
            animate={{ width: "95%" }}
            transition={{ duration: 3.5, ease: "easeOut" }}
          />
        )}
      </button>

      {/* Alternative direct contacts */}
      <p className="text-center text-xs text-foreground/60">
        Direct questions?{" "}
        <a className="underline underline-offset-4 hover:text-foreground" href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        {" · "}
        <a className="underline underline-offset-4 hover:text-foreground" href={SITE.phoneHref}>
          Call {SITE.phoneDisplay}
        </a>
        {" · "}
        <a className="underline underline-offset-4 hover:text-foreground" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      </p>
        </form>
      )}
    </div>
  )
}

export function ContactLinks() {
  const base =
    "group flex min-h-[64px] items-center gap-4 rounded-xl border border-foreground/15 bg-surface/40 px-5 py-3 transition-colors hover:border-accent/60 hover:bg-accent/5"
  return (
    <ul className="flex flex-col gap-3">
      <li>
        <a href={`mailto:${SITE.email}`} className={base}>
          <Mail size={22} className="text-accent" aria-hidden />
          <span className="flex flex-col">
            <span className="text-xs text-foreground/60">Email</span>
            <span className="font-medium text-foreground break-all">{SITE.email}</span>
          </span>
        </a>
      </li>
      <li>
        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className={base}>
          <MessageCircle size={22} className="text-accent" aria-hidden />
          <span className="flex flex-col">
            <span className="text-xs text-foreground/60">WhatsApp</span>
            <span className="font-medium text-foreground">{SITE.phoneDisplay}</span>
          </span>
        </a>
      </li>
      <li>
        <a href={SITE.phoneHref} className={base}>
          <Phone size={22} className="text-accent" aria-hidden />
          <span className="flex flex-col">
            <span className="text-xs text-foreground/60">Direct Call</span>
            <span className="font-medium text-foreground">{SITE.phoneDisplay}</span>
          </span>
        </a>
      </li>
    </ul>
  )
}
