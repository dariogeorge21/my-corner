"use client"

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion"
import { useState, useRef, useEffect, useCallback, useId } from "react"
import { ArrowRight, X, CheckCircle, AlertTriangle, Loader2, Globe, Monitor, HardDrive, FileText, ChevronRight, Wrench, Keyboard, Server } from "lucide-react"
import { submitContact } from "@/app/actions/contact"
import type { ContactResponse } from "@/app/actions/contact"

// ─── Validation ─────────────────────────────────────────────────────────────
const XSS_URL_REGEX = /(https?:\/\/[^\s]+|<[^>]*>)/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ─── Types ───────────────────────────────────────────────────────────────────
type ServiceType = "Web Development" | "Software & Hardware Support" | "Reports & Documentation" | ""

interface FormState {
  name: string
  email: string
  subject: string
  description: string
}

// ─── Animation Variants ──────────────────────────────────────────────────────
const fadeUpVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
} as const

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
} as const

// ─── Reusable AnimatedInput ──────────────────────────────────────────────────
interface AnimatedInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  isTextArea?: boolean
  isSelect?: boolean
  selectOptions?: { value: string; label: string }[]
  isInvalid?: boolean
  isValid?: boolean
  id: string
  [key: string]: unknown
}

function AnimatedInput({
  label,
  value,
  onChange,
  isTextArea = false,
  isSelect = false,
  selectOptions = [],
  isInvalid = false,
  isValid = false,
  id,
  ...props
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(null)

  const borderColor = isInvalid
    ? "border-red-500"
    : isValid
      ? "border-green-500"
      : "border-foreground/10"

  const labelColor = isInvalid
    ? "text-red-500"
    : isValid
      ? "text-green-500"
      : active
        ? "text-accent"
        : "text-foreground/60"

  return (
    <div
      className={`group relative flex flex-col justify-end min-h-[4rem] border-b pb-3 cursor-text transition-colors hover:border-foreground/30 ${borderColor}`}
      onClick={() => inputRef.current?.focus()}
    >
      <label htmlFor={id} className={`font-mono text-sm uppercase tracking-widest transition-all duration-300 ${labelColor}`}>
        {label}{active ? ":" : ""}
      </label>

      {isSelect ? (
        <select
          ref={inputRef as React.RefObject<HTMLSelectElement>}
          id={id}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`bg-transparent outline-none flex-1 text-lg md:text-xl transition-all duration-300 ${isInvalid ? "text-red-500" : isValid ? "text-green-500" : "text-foreground"} cursor-pointer mt-1`}
          aria-invalid={isInvalid}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
      ) : isTextArea ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`bg-transparent outline-none flex-1 text-lg md:text-xl transition-all duration-300 resize-none overflow-hidden min-h-[4rem] leading-tight ${isInvalid ? "text-red-500" : isValid ? "text-green-500" : "text-foreground"} ${active ? "opacity-100" : "opacity-0"}`}
          aria-invalid={isInvalid}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          id={id}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`bg-transparent outline-none flex-1 text-lg md:text-xl transition-all duration-300 h-8 md:h-10 leading-tight ${isInvalid ? "text-red-500" : isValid ? "text-green-500" : "text-foreground"} ${active ? "opacity-100 w-full" : "opacity-0 w-0"}`}
          aria-invalid={isInvalid}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      <motion.span
        className={`absolute bottom-0 left-0 w-full h-[2px] origin-left ${isInvalid ? "bg-red-500" : isValid ? "bg-green-500" : "bg-accent"}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </div>
  )
}

// ─── Service Contact Modal ────────────────────────────────────────────────────
interface ServiceModalProps {
  isOpen: boolean
  onClose: () => void
  defaultServiceType: ServiceType
}

function ServiceModal({ isOpen, onClose, defaultServiceType }: ServiceModalProps) {
  const titleId = useId()
  const formId = useId()
  const shouldReduceMotion = useReducedMotion()

  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    subject: defaultServiceType || "",
    description: "",
  })
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, description: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "whatsapp" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)

  // Sync subject when defaultServiceType changes (modal reopened for different service)
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, subject: defaultServiceType || "" }))
      setTouched({ name: false, email: false, subject: false, description: false })
      setFormStatus("idle")
      setErrorMessage("")
    }
  }, [isOpen, defaultServiceType])

  // Focus trap + ESC close
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "Tab") {
        const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
      }
    }
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKeyDown)
    firstFocusRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  // Validation
  const isNameValid = formData.name.length >= 5 && formData.name.length <= 30 && !XSS_URL_REGEX.test(formData.name)
  const isEmailValid = EMAIL_REGEX.test(formData.email) && !XSS_URL_REGEX.test(formData.email)
  const isSubjectValid = formData.subject.length >= 4 && formData.subject.length <= 30
  const isDescValid = formData.description.length >= 10 && formData.description.length <= 500 && !XSS_URL_REGEX.test(formData.description)
  const isFormValid = isNameValid && isEmailValid && isSubjectValid && isDescValid

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, field: keyof FormState) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))
      setTouched((prev) => ({ ...prev, [field]: true }))
    },
    []
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({ name: true, email: true, subject: true, description: true })
    if (!isFormValid) return

    setIsSubmitting(true)
    setFormStatus("idle")
    setErrorMessage("")

    try {
      const response: ContactResponse = await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject.slice(0, 30),
        description: formData.description.slice(0, 100),
      })

      if (!response.ok) {
        setFormStatus("error")
        setErrorMessage(response.error || "Failed to send message. Please try again.")
        return
      }

      if (response.channel === "email") {
        setFormStatus("success")
        setFormData({ name: "", email: "", subject: defaultServiceType || "", description: "" })
        setTouched({ name: false, email: false, subject: false, description: false })
        setTimeout(() => { setFormStatus("idle"); onClose() }, 3000)
        return
      }

      if (response.channel === "whatsapp" && response.whatsappUrl) {
        setWhatsappUrl(response.whatsappUrl)
        setFormStatus("whatsapp")
        setFormData({ name: "", email: "", subject: defaultServiceType || "", description: "" })
        setTouched({ name: false, email: false, subject: false, description: false })
        setTimeout(() => {
          window.open(response.whatsappUrl, "_blank")
          setFormStatus("idle")
          onClose()
        }, 1500)
      }
    } catch {
      setFormStatus("error")
      setErrorMessage("A network error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const serviceOptions = [
    { value: "Web Development", label: "Web Development" },
    { value: "Software & Hardware Support", label: "Software & Hardware Support" },
    { value: "Reports & Documentation", label: "Reports & Documentation" },
    { value: "Other", label: "Other / Custom Inquiry" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal — centered via flex wrapper to avoid Framer Motion transform conflicts */}
          <div
            className="fixed inset-0 z-[90] flex items-center justify-center w-full h-full p-4 pointer-events-none"
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.95, filter: "blur(10px)" }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97, filter: "blur(5px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative w-full max-w-[600px] max-h-[90vh] overflow-y-auto bg-background border border-foreground/10 shadow-2xl pointer-events-auto"
              style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between p-6 md:p-10 border-b border-foreground/10">
                <div>
                  <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase mb-2">[ SERVICE INQUIRY ]</p>
                  <h2 id={titleId} className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Start a Project
                  </h2>
                </div>
                <button
                  ref={firstFocusRef}
                  onClick={onClose}
                  className="p-2 rounded-sm hover:bg-foreground/10 transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  aria-label="Close dialog"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Form */}
              <form
                id={formId}
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-8 p-6 md:p-10"
              >
                <AnimatedInput
                  id={`${formId}-name`}
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleChange(e, "name")}
                  isInvalid={touched.name && !isNameValid}
                  isValid={touched.name && isNameValid}
                  maxLength={30}
                  autoComplete="name"
                  placeholder="Your full name"
                  aria-describedby={touched.name && !isNameValid ? `${formId}-name-error` : undefined}
                />
                {touched.name && !isNameValid && (
                  <p id={`${formId}-name-error`} className="text-red-500 text-xs font-mono mt-1" role="alert">
                    Name must be 5–30 characters, no URLs or HTML.
                  </p>
                )}

                <AnimatedInput
                  id={`${formId}-email`}
                  label="Email Address"
                  value={formData.email}
                  onChange={(e) => handleChange(e, "email")}
                  isInvalid={touched.email && !isEmailValid}
                  isValid={touched.email && isEmailValid}
                  type="email"
                  autoComplete="email"
                  aria-describedby={touched.email && !isEmailValid ? `${formId}-email-error` : undefined}
                />
                {touched.email && !isEmailValid && (
                  <p id={`${formId}-email-error`} className="text-red-500 text-xs font-mono mt-1" role="alert">
                    Please enter a valid email address.
                  </p>
                )}

                <AnimatedInput
                  id={`${formId}-subject`}
                  label="Service Type"
                  value={formData.subject}
                  onChange={(e) => handleChange(e, "subject")}
                  isSelect
                  selectOptions={serviceOptions}
                  isInvalid={touched.subject && !isSubjectValid}
                  isValid={touched.subject && isSubjectValid}
                />

                <AnimatedInput
                  id={`${formId}-description`}
                  label="Project Details"
                  value={formData.description}
                  onChange={(e) => handleChange(e, "description")}
                  isTextArea
                  isInvalid={touched.description && !isDescValid}
                  isValid={touched.description && isDescValid}
                  maxLength={500}
                  placeholder="Describe your project, requirements, timeline..."
                  aria-describedby={touched.description && !isDescValid ? `${formId}-desc-error` : undefined}
                />
                {touched.description && !isDescValid && (
                  <p id={`${formId}-desc-error`} className="text-red-500 text-xs font-mono mt-1" role="alert">
                    Project details must be 10–500 characters, no URLs or HTML.
                  </p>
                )}

                {/* Status messages */}
                <AnimatePresence>
                  {formStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 text-red-500 font-mono text-sm p-4 bg-red-500/10 border border-red-500/20"
                      role="alert"
                      aria-live="assertive"
                    >
                      <AlertTriangle size={16} aria-hidden="true" />
                      [ERROR]: {errorMessage}
                    </motion.div>
                  )}
                  {formStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 text-green-500 font-mono text-sm p-4 bg-green-500/10 border border-green-500/20"
                      role="alert"
                      aria-live="polite"
                    >
                      <CheckCircle size={16} aria-hidden="true" />
                      ✓ Message sent! I&apos;ll get back to you soon.
                    </motion.div>
                  )}
                  {formStatus === "whatsapp" && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-3 text-yellow-400 font-mono text-xs p-4 bg-yellow-400/10 border border-yellow-400/20"
                      role="alert"
                      aria-live="polite"
                    >
                      ↗ Opening WhatsApp fallback…
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="flex justify-end pt-2">
                  <motion.button
                    type="submit"
                    disabled={isSubmitting || formStatus === "success"}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    className="group relative flex items-center gap-3 bg-foreground text-background px-8 py-4 font-medium tracking-widest uppercase text-sm hover:bg-accent hover:text-white transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
                    aria-label={isSubmitting ? "Sending your message" : "Send inquiry"}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                        Transmitting…
                      </>
                    ) : (
                      <>
                        Send Inquiry
                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
function ServicesHero() {
  const shouldReduceMotion = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  const line1X = useTransform(scrollY, [0, 600], [0, -100])
  const line2X = useTransform(scrollY, [0, 600], [0, 80])
  const line3X = useTransform(scrollY, [0, 600], [0, -60])
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.3])
  const heroScale = useTransform(scrollY, [0, 500], [1, 0.92])

  const smoothLine1X = useSpring(line1X, { stiffness: 80, damping: 20 })
  const smoothLine2X = useSpring(line2X, { stiffness: 80, damping: 20 })
  const smoothLine3X = useSpring(line3X, { stiffness: 80, damping: 20 })

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-start justify-center overflow-hidden bg-background px-6 md:px-12 lg:px-16"
      style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
      aria-label="Services page hero"
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60" />
        {/* Accent radial glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-3xl max-h-3xl rounded-full bg-accent/5 blur-[120px]" />
      </div>

      {/* Top label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex items-center gap-4 mb-8 md:mb-12"
      >
        <span className="w-8 h-[1px] bg-accent" aria-hidden="true" />
        <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-medium">
          [ SERVICES ]
        </span>
      </motion.div>

      {/* Massive hero headline */}
      <motion.h1
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 flex flex-col items-start w-full max-w-[95vw] 2xl:max-w-[1600px] overflow-visible"
      >
        <span className="sr-only">I provide multiple services across India</span>

        {/* Line 1 */}
        <motion.span
          style={shouldReduceMotion ? {} : { x: smoothLine1X }}
          initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="block text-[12vw] sm:text-[11vw] md:text-[9vw] lg:text-[8.5vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground will-change-transform"
        >
          I PROVIDE
        </motion.span>

        {/* Line 2 — accent word */}
        <motion.span
          style={shouldReduceMotion ? {} : { x: smoothLine2X }}
          initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="block text-[12vw] sm:text-[11vw] md:text-[9vw] lg:text-[8.5vw] font-black leading-[0.85] tracking-tighter uppercase text-accent will-change-transform ml-[8vw] md:ml-[6vw]"
        >
          MULTIPLE
        </motion.span>

        {/* Line 3 */}
        <motion.span
          style={shouldReduceMotion ? {} : { x: smoothLine3X }}
          initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="block text-[12vw] sm:text-[11vw] md:text-[9vw] lg:text-[8.5vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground/70 will-change-transform"
        >
          SERVICES
        </motion.span>

        {/* Line 4 */}
        <motion.span
          initial={{ opacity: 0, y: 50, filter: "blur(15px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="block text-[12vw] sm:text-[11vw] md:text-[9vw] lg:text-[8.5vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground/40 will-change-transform ml-[4vw] md:ml-[3vw]"
        >
          ACROSS INDIA
        </motion.span>
      </motion.h1>

      {/* Subtitle & CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6"
      >
        <p className="text-foreground/50 font-mono text-xs md:text-sm tracking-widest max-w-xs leading-relaxed">
          Web development · Software & hardware support · Professional documentation — delivered pan-India.
        </p>
        <a
          href="#web-development"
          className="group flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase text-foreground border border-foreground/20 px-6 py-3 hover:border-accent hover:text-accent transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          aria-label="Explore services"
        >
          Explore Services
          <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </a>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        aria-hidden="true"
      >
        <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/30">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] h-8 bg-gradient-to-b from-foreground/30 to-transparent"
        />
      </motion.div>
    </section>
  )
}

// ─── Web Development Section ──────────────────────────────────────────────────
const webDevOfferings = [
  { label: "Custom Websites", desc: "Tailored, high-performance sites built for your brand and goals" },
  { label: "Business Landing Pages", desc: "Conversion-focused pages that drive leads and revenue" },
  { label: "Personal Portfolios", desc: "Striking portfolio sites to showcase your work and identity" },
  { label: "E-Commerce Platforms", desc: "Full-featured online stores with secure checkout and inventory" },
  { label: "SaaS Web Applications", desc: "Scalable, full-stack apps with auth, database, and APIs" },
  { label: "Client-Focused Projects", desc: "Any web project tailored to your specific requirements" },
]

interface WebDevSectionProps {
  onOpenModal: (service: ServiceType) => void
}

function WebDevSection({ onOpenModal }: WebDevSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section
      id="web-development"
      className="relative py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full"
      style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
      aria-label="Web Development services"
    >
      {/* Section grid bg */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" aria-hidden="true" />

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 relative z-10">
        {/* Left sticky column */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="lg:sticky lg:top-36 w-full lg:w-2/5 h-fit"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-[1px] bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase">[ 01 ]</span>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Globe size={28} className="text-accent mt-1 shrink-0" aria-hidden="true" />
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-foreground">
              Web<br />
              <span className="text-accent">Development</span>
            </h2>
          </div>

          <p className="text-foreground/50 text-sm md:text-base leading-relaxed max-w-sm mb-4">
            From high-performance corporate websites to full-stack web applications. I build scalable, accessible, and visually striking digital experiences — delivered pan-India.
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {["Next.js", "React", "TypeScript", "Tailwind", "Framer Motion"].map((tag) => (
              <span key={tag} className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 border border-foreground/15 rounded-full text-foreground/50">
                {tag}
              </span>
            ))}
          </div>

          <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-foreground/30">
            <span className="w-4 h-[1px] bg-foreground/30" aria-hidden="true" />
            PAN-INDIA DELIVERY
          </span>
        </motion.div>

        {/* Right: Offerings Grid — entire section clickable */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="w-full lg:w-3/5"
        >
          <button
            type="button"
            onClick={() => onOpenModal("Web Development")}
            className="w-full text-left group focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background focus-visible:outline-none rounded-sm"
            aria-label="Inquire about Web Development services — opens contact form"
          >
            <div className="border border-foreground/10 hover:border-foreground/25 transition-colors duration-500 relative overflow-hidden">
              {/* Hover shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                aria-hidden="true"
              />

              <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest uppercase text-foreground/50">
                  Tap to inquire
                </span>
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="flex items-center gap-2 text-accent"
                  aria-hidden="true"
                >
                  <ArrowRight size={16} />
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-foreground/10">
                {webDevOfferings.map((offering, idx) => (
                  <motion.div
                    key={offering.label}
                    variants={itemVariant}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`p-6 border-b border-foreground/10 transition-colors duration-300 ${hoveredIndex === idx ? "bg-accent/5" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-[10px] text-foreground/30 mt-1 shrink-0">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className={`font-bold text-base md:text-lg tracking-tight transition-colors duration-300 ${hoveredIndex === idx ? "text-accent" : "text-foreground"}`}>
                          {offering.label}
                        </h3>
                        <p className="text-foreground/50 text-xs leading-relaxed mt-1">{offering.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="p-6 flex items-center justify-between border-t border-foreground/10">
                <span className="text-foreground/40 text-sm font-mono tracking-widest uppercase">
                  Get a free consultation
                </span>
                <div className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-300" aria-hidden="true">
                  <ArrowRight size={16} className="text-foreground/40 group-hover:text-accent transition-colors duration-300" />
                </div>
              </div>
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Software & Hardware Support Section ─────────────────────────────────────
const softwareOfferings = [
  { category: "Quick Heal", items: ["Antivirus Pro", "Internet Security", "Total Security"] },
  { category: "Norton", items: ["Norton Plus", "Norton 360 Standard", "Norton 360 Deluxe"] },
  { category: "Microsoft", items: ["Office 2024 (One-time)", "Microsoft 365 Personal", "Microsoft 365 Family"] },
  { category: "Services", items: ["In-home / Office Installation", "Product Activation & License Management", "Pre-expiry License Renewal"] },
]

const hardwareOfferings = [
  { icon: <Server />, label: "SSDs & Storage", desc: "High-performance solid state drives, HDDs, and NVMe storage" },
  { icon: <Keyboard />, label: "Computer Peripherals", desc: "Keyboards, mice, monitors, headsets, and all accessories" },
  { icon: <Monitor />, label: "Custom-Built PCs", desc: "Bespoke desktop builds tailored to your workload and budget" },
  { icon: <Wrench />, label: "PC Hardware Products", desc: "All PC components — RAM, CPUs, GPUs, motherboards, coolers" },
]

interface SoftwareHardwareSectionProps {
  onOpenModal: (service: ServiceType) => void
}

function SoftwareHardwareSection({ onOpenModal }: SoftwareHardwareSectionProps) {
  return (
    <section
      id="software-hardware"
      className="relative py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full overflow-hidden"
      style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
      aria-label="Software and Hardware Support services"
    >
      {/* Terminal scanline aesthetic */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(153,95,47,0.015)_2px,rgba(153,95,47,0.015)_4px)]" />
      </div>

      {/* Section header */}
      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 mb-16 md:mb-24"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="w-8 h-[1px] bg-accent" aria-hidden="true" />
          <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase">[ 02 ]</span>
        </div>
        <div className="flex items-start gap-4">
          <Monitor size={28} className="text-accent mt-2 shrink-0" aria-hidden="true" />
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-foreground">
            Software &<br />
            <span className="text-accent">Hardware</span><br />
            Support
          </h2>
        </div>
      </motion.div>

      <div className="relative z-10 grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-12">

        {/* ── Software Support ── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          <div className="border border-foreground/15 h-full">
            {/* Terminal header bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/15 bg-foreground/[0.03]" aria-hidden="true">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
              <span className="font-mono text-[10px] tracking-widest text-foreground/30 ml-2 uppercase">software-support.exe</span>
            </div>

            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <Monitor size={20} className="text-accent" aria-hidden="true" />
                <h3 className="font-mono text-sm tracking-widest uppercase text-foreground font-bold">Software Support</h3>
              </div>

              {/* Software categories */}
              <div className="space-y-6">
                {softwareOfferings.map((group) => (
                  <div key={group.category} className="border-l-2 border-accent/30 pl-4">
                    <p className="font-mono text-xs tracking-widest uppercase text-accent mb-2">{group.category}</p>
                    <ul className="space-y-1.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-foreground/70 text-sm">
                          <span className="text-accent/50 font-mono text-xs" aria-hidden="true">›</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onOpenModal("Software & Hardware Support")}
                className="mt-8 group flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-foreground/60 hover:text-accent transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-sm"
                aria-label="Inquire about Software Support"
              >
                Inquire About Software Support
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Hardware Support ── */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: 0.15 }}
        >
          <div className="border border-foreground/15 h-full bg-accent/[0.02]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-foreground/15">
              <div className="flex items-center gap-3">
                <HardDrive size={20} className="text-accent" aria-hidden="true" />
                <h3 className="font-mono text-sm tracking-widest uppercase text-foreground font-bold">Hardware Support</h3>
              </div>
              <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/30 px-2 py-1 border border-foreground/10">PAN-INDIA</span>
            </div>

            <div className="p-6 md:p-8">
              <p className="text-foreground/50 text-sm leading-relaxed mb-8 max-w-sm">
                Premium PC hardware products delivered across India — from individual components to complete custom-built systems.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hardwareOfferings.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="group p-4 border border-foreground/10 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300"
                  >
                    <span className="text-2xl mb-3 block" aria-hidden="true">{item.icon}</span>
                    <h4 className="font-bold text-sm text-foreground mb-1 group-hover:text-accent transition-colors duration-300">{item.label}</h4>
                    <p className="text-foreground/40 text-xs leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>

              {/* Delivery badge */}
              <div className="mt-8 flex items-center gap-3 p-4 bg-accent/5 border border-accent/20">
                <span className="text-accent font-mono text-xs" aria-hidden="true">◆</span>
                <p className="font-mono text-xs text-foreground/60 tracking-wide">
                  All hardware products shipped pan-India with reliable logistics partners.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onOpenModal("Software & Hardware Support")}
                className="mt-8 group flex items-center gap-3 font-mono text-xs tracking-widest uppercase text-foreground/60 hover:text-accent transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-sm"
                aria-label="Inquire about Hardware Support"
              >
                Inquire About Hardware
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

// ─── Reports & Documentation Section ─────────────────────────────────────────
const docTypes = [
  {
    label: "Product Documentation",
    desc: "Comprehensive user manuals, technical specs, API references, and product guides",
    tag: "Technical",
  },
  {
    label: "Research Papers",
    desc: "Structured academic and professional research papers with proper formatting and citations",
    tag: "Academic",
  },
  {
    label: "Project Reports",
    desc: "Academic project reports, feasibility studies, progress reports, and final documentation",
    tag: "Academic",
  },
  {
    label: "Digital Documentation",
    desc: "Any type of professional digital document — SOPs, process guides, knowledge bases",
    tag: "Professional",
  },
]

interface ReportsSectionProps {
  onOpenModal: (service: ServiceType) => void
}

function ReportsSection({ onOpenModal }: ReportsSectionProps) {
  const [activeDoc, setActiveDoc] = useState<number | null>(null)

  return (
    <section
      id="reports-documentation"
      className="relative py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full"
      style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
      aria-label="Reports and Documentation services"
    >
      {/* Editorial dotted background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(153,95,47,0.06)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>

      <div className="relative z-10">
        {/* Section header — editorial style */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mb-16 md:mb-24"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-[1px] bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase">[ 03 ]</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16">
            <div className="flex items-start gap-4">
              <FileText size={28} className="text-accent mt-2 shrink-0" aria-hidden="true" />
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] text-foreground">
                Reports &<br />
                <span className="text-accent">Documentation</span>
              </h2>
            </div>

            {/* Pull-quote callout */}
            <div className="lg:max-w-sm border-l-4 border-accent pl-6 py-2">
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed italic font-medium">
                &ldquo;Professional. Precise. Purely digital — no handwritten deliverables, ever.&rdquo;
              </p>
              <p className="text-foreground/30 font-mono text-xs tracking-widest uppercase mt-3">
                — Dario George
              </p>
            </div>
          </div>
        </motion.div>

        {/* Digital-only callout banner */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-12 p-4 md:p-6 bg-accent/5 border border-accent/20 flex items-start gap-4"
          role="note"
          aria-label="Service note: digital only"
        >
          <span className="text-accent font-bold text-xl mt-0.5" aria-hidden="true">✦</span>
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-accent mb-1">Important Note</p>
            <p className="text-foreground/70 text-sm leading-relaxed">
              All documentation is delivered exclusively in digital formats (PDF, DOCX, MD, HTML, etc.).
              <strong className="text-foreground"> No handwritten deliverables</strong> are produced under this service.
            </p>
          </div>
        </motion.div>

        {/* Doc types — accordion/reveal style */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="border-t border-foreground/10"
        >
          {docTypes.map((doc, idx) => (
            <motion.div
              key={doc.label}
              variants={itemVariant}
              className="border-b border-foreground/10 group"
            >
              <button
                type="button"
                onClick={() => setActiveDoc(activeDoc === idx ? null : idx)}
                className="w-full text-left py-6 md:py-8 px-0 flex items-center justify-between gap-6 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none rounded-sm"
                aria-expanded={activeDoc === idx}
                aria-controls={`doc-panel-${idx}`}
                id={`doc-header-${idx}`}
              >
                <div className="flex items-center gap-6 min-w-0">
                  <span className="font-mono text-xs text-foreground/30 tracking-wider shrink-0">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className={`text-xl md:text-3xl lg:text-4xl font-bold tracking-tight transition-colors duration-300 ${activeDoc === idx ? "text-foreground" : "text-foreground/50 group-hover:text-foreground/80"}`}>
                    {doc.label}
                  </h3>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="hidden sm:block font-mono text-[10px] uppercase tracking-widest px-3 py-1 border border-foreground/15 text-foreground/40">
                    {doc.tag}
                  </span>
                  <motion.div
                    animate={{ rotate: activeDoc === idx ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden="true"
                  >
                    <ChevronRight size={20} className="text-foreground/40" />
                  </motion.div>
                </div>
              </button>

              <AnimatePresence>
                {activeDoc === idx && (
                  <motion.div
                    id={`doc-panel-${idx}`}
                    role="region"
                    aria-labelledby={`doc-header-${idx}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 md:pb-8 pl-12 md:pl-14">
                      <p className="text-foreground/60 text-sm md:text-base leading-relaxed max-w-2xl">
                        {doc.desc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <button
            type="button"
            onClick={() => onOpenModal("Reports & Documentation")}
            className="group relative flex items-center gap-3 bg-foreground text-background px-8 py-4 font-medium tracking-widest uppercase text-sm hover:bg-accent hover:text-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            aria-label="Request documentation service"
          >
            Request Documentation
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <p className="text-foreground/30 font-mono text-xs tracking-widest uppercase">
            All formats · Pan-India · Digital only
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
interface CTABannerProps {
  onOpenModal: (service: ServiceType) => void
}

function CTABanner({ onOpenModal }: CTABannerProps) {
  return (
    <section
      className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden"
      style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
      aria-label="Call to action"
    >
      <div className="absolute inset-0 bg-foreground/[0.03] border-y border-foreground/10" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 pointer-events-none" aria-hidden="true" />

      <motion.div
        variants={fadeUpVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
      >
        <div>
          <p className="font-mono text-xs tracking-[0.3em] text-accent uppercase mb-4">[ READY TO START? ]</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight text-foreground">
            Let&apos;s build something<br />
            <span className="text-accent">remarkable</span> together.
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => onOpenModal("Web Development")}
            className="group flex items-center gap-3 bg-foreground text-background px-8 py-4 font-medium tracking-widest uppercase text-sm hover:bg-accent hover:text-white transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none"
            aria-label="Start a project"
          >
            Start a Project
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </button>
          <a
            href="mailto:contact@dariogeorge.in"
            className="group flex items-center gap-3 border border-foreground/20 px-8 py-4 font-mono text-sm tracking-widest uppercase text-foreground hover:border-accent hover:text-accent transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            aria-label="Send an email directly"
          >
            Email Directly
          </a>
        </div>
      </motion.div>
    </section>
  )
}

// ─── Main Page Component ──────────────────────────────────────────────────────
export default function ServicesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeServiceType, setActiveServiceType] = useState<ServiceType>("")

  const openModal = useCallback((service: ServiceType) => {
    setActiveServiceType(service)
    setIsModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      {/* Skip to main content (accessibility) */}
      <a
        href="#web-development"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[200] focus:top-4 focus:left-4 focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:tracking-widest focus:uppercase"
      >
        Skip to services
      </a>

      <div
        className="flex flex-col"
        style={{ fontFamily: "var(--font-google-sans-flex, sans-serif)" }}
      >
        {/* Hero */}
        <ServicesHero />

        {/* Service 01 — Web Development */}
        <WebDevSection onOpenModal={openModal} />

        {/* Divider */}
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12" aria-hidden="true">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        </div>

        {/* Service 02 — Software & Hardware Support */}
        <SoftwareHardwareSection onOpenModal={openModal} />

        {/* Divider */}
        <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12" aria-hidden="true">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
        </div>

        {/* Service 03 — Reports & Documentation */}
        <ReportsSection onOpenModal={openModal} />

        {/* CTA Banner */}
        <CTABanner onOpenModal={openModal} />
      </div>

      {/* Service Contact Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={closeModal}
        defaultServiceType={activeServiceType}
      />
    </>
  )
}
