"use client"

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useReducedMotion,
} from "framer-motion"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useTheme } from "next-themes"
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Layers,
  Cpu,
  Wrench,
  Globe,
  CheckCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Mail,
} from "lucide-react"
import BorderGlow from "@/components/BorderGlow"
import { submitContact, type ContactResponse } from "@/app/actions/contact"

// ─── VALIDATION ──────────────────────────────────────────────────────────────
const XSS_URL_REGEX = /(https?:\/\/[^\s]+|<[^>]*>)/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^(\+?[\d\s\-().]{7,20})?$/

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
} as const

const fadeUpVariants = {
  hidden: { opacity: 0, y: 60, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
} as const

const wordRevealVariants = {
  hidden: { opacity: 0, y: 40, clipPath: "inset(0 0 100% 0)" },
  visible: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
} as const

const tagVariant = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
} as const

// ─── BRACKET LABEL ────────────────────────────────────────────────────────────
function BracketLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="w-8 h-[1px] bg-accent" />
      <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-medium">
        [ {children} ]
      </span>
    </div>
  )
}

// ─── ANIMATED INPUT ───────────────────────────────────────────────────────────
interface AnimatedInputProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  isTextArea?: boolean
  isInvalid?: boolean
  isValidField?: boolean
  id: string
  hint?: string
  [key: string]: unknown
}

function AnimatedInput({
  label,
  value,
  onChange,
  isTextArea = false,
  isInvalid = false,
  isValidField = false,
  id,
  hint,
  ...props
}: AnimatedInputProps) {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const borderColor = isInvalid ? "border-red-500" : isValidField ? "border-green-500" : "border-foreground/10"
  const labelColor = isInvalid ? "text-red-500" : isValidField ? "text-green-500" : active ? "text-accent" : "text-foreground/50"
  const inputColor = isInvalid ? "text-red-500" : isValidField ? "text-green-500" : "text-foreground"
  const underlineBg = isInvalid ? "bg-red-500" : isValidField ? "bg-green-500" : "bg-accent"

  return (
    <div className="flex flex-col gap-1">
      <motion.div
        className={`group relative flex flex-col justify-end min-h-[4rem] border-b pb-3 cursor-text transition-colors hover:border-foreground/30 ${borderColor}`}
        onClick={() => inputRef.current?.focus()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="flex items-end gap-3 w-full">
          <span className={`font-mono text-sm md:text-base uppercase tracking-widest transition-all duration-300 ${labelColor}`}>
            {label}{active ? ":" : ""}
          </span>
          {!active && (
            <div className={`h-[2px] w-8 transition-opacity duration-300 group-hover:opacity-30 ${isInvalid ? "bg-red-500" : isValidField ? "bg-green-500" : "bg-foreground/40"}`} />
          )}
          {isTextArea ? (
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              id={id}
              value={value}
              onChange={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={`bg-transparent outline-none flex-1 text-xl md:text-2xl transition-all duration-300 resize-none overflow-hidden h-8 md:h-10 leading-tight ${inputColor} ${active ? "opacity-100 w-full" : "opacity-0 w-0"}`}
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
              className={`bg-transparent outline-none flex-1 text-xl md:text-2xl transition-all duration-300 h-8 md:h-10 leading-tight ${inputColor} ${active ? "opacity-100 w-full" : "opacity-0 w-0"}`}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
        </div>
        <motion.span
          className={`absolute bottom-0 left-0 w-full h-[2px] origin-left ${underlineBg}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </motion.div>
      {hint && <p className="font-mono text-[10px] text-foreground/25 tracking-wide">{hint}</p>}
    </div>
  )
}

// ─── TECH TAG ─────────────────────────────────────────────────────────────────
function TechTag({ label }: { label: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.span
      variants={tagVariant}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative inline-flex items-center px-3 py-1.5 text-sm font-mono tracking-wide border border-foreground/10 bg-surface/5 backdrop-blur-sm cursor-default select-none"
    >
      <motion.span
        className="absolute inset-0 bg-accent/10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: 0 }}
      />
      <span className={`relative z-10 transition-colors duration-300 ${hovered ? "text-accent" : "text-foreground/60"}`}>
        {label}
      </span>
    </motion.span>
  )
}

// ─── PHILOSOPHY PRINCIPLE ─────────────────────────────────────────────────────
function Principle({ text, index }: { text: string; index: number }) {
  const isLarge = null
  return (
    <motion.div
      variants={fadeUpVariants}
      className="border-b border-foreground/10 py-6 flex items-baseline gap-6 group hover:border-foreground/30 transition-colors duration-500"
    >
      <span className="font-mono text-xs text-foreground/20 tracking-widest shrink-0 w-8">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className={`${isLarge ? "text-2xl md:text-3xl font-bold" : "text-xl md:text-2xl font-medium"} text-foreground/80 group-hover:text-foreground transition-colors duration-500 leading-tight`}>
        {text}
      </p>
      <span className="ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <ArrowUpRight size={16} className="text-accent" />
      </span>
    </motion.div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const heroRef = useRef<HTMLElement>(null)
  const bioRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  const actualTheme = mounted ? (theme === "system" ? systemTheme : theme) : "dark"

  const themeColors = useMemo(() => {
    if (actualTheme === "dark") {
      return {
        glowColor: "228 214 169",
        backgroundColor: "rgba(20, 16, 14, 0.4)",
        palette: ["#E4D6A9", "#995F2F", "#622B14"],
      }
    }
    return {
      glowColor: "153 95 47",
      backgroundColor: "rgba(250, 249, 246, 0.5)",
      palette: ["#995F2F", "#E4D6A9", "#2A1D17"],
    }
  }, [actualTheme])

  // Hero scroll parallax
  const { scrollYProgress: heroScrollY } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
  const heroTextY = useTransform(heroScrollY, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(heroScrollY, [0, 0.6], [1, 0])

  // Bio scroll parallax
  const { scrollYProgress: bioScrollY } = useScroll({ target: bioRef, offset: ["start end", "end start"] })
  const bioCardY = useTransform(bioScrollY, [0, 1], ["5%", "-10%"])
  const bioCardRotate = useTransform(bioScrollY, [0, 1], [0.5, -0.5])

  // Form mouse glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 })
  const glowPosition = useMotionTemplate`radial-gradient(circle 300px at ${smoothMouseX}px ${smoothMouseY}px, rgba(255,255,255,0.08), transparent 80%)`
  const formRotateX = useTransform(smoothMouseY, [0, 500], [2, -2])
  const formRotateY = useTransform(smoothMouseX, [0, 500], [-2, 2])

  const handleFormMouseMove = useCallback((e: React.MouseEvent) => {
    if (!formRef.current) return
    const rect = formRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])
  const handleFormMouseLeave = useCallback(() => { mouseX.set(0); mouseY.set(0) }, [mouseX, mouseY])

  // Rotating hero keywords
  const heroKeywords = useMemo(() => ["ARCHITECT", "BUILDER", "CREATOR", "ENGINEER"], [])
  const [heroKeyIndex, setHeroKeyIndex] = useState(0)
  useEffect(() => {
    if (shouldReduceMotion) return
    const t = setInterval(() => setHeroKeyIndex(p => (p + 1) % heroKeywords.length), 2500)
    return () => clearInterval(t)
  }, [shouldReduceMotion, heroKeywords.length])

  // Tech expertise tabs
  const techCategories = useMemo(() => [
    {
      id: "frontend", label: "Frontend", icon: <Layers size={16} />,
      techs: ["Next.js", "React", "TypeScript", "JavaScript (ES6+)", "HTML5", "CSS3", "Tailwind CSS", "ShadCN UI", "Framer Motion", "Responsive Design"],
    },
    {
      id: "backend", label: "Backend", icon: <Globe size={16} />,
      techs: ["Next.js Server Actions", "API Routes", "Node.js", "Supabase", "PostgreSQL", "Auth Systems", "Database Design", "RBAC", "REST APIs"],
    },
    {
      id: "ai", label: "AI / LLM", icon: <Cpu size={16} />,
      techs: ["AI Chat Apps", "Voice AI", "AI Integrations", "Prompt Engineering", "LLM Integrations", "AI Automation", "OpenAI", "Google Gemini", "Groq"],
    },
    {
      id: "tools", label: "Tools", icon: <Wrench size={16} />,
      techs: ["Git", "GitHub", "Vercel", "Docker", "Linux", "VS Code", "Figma", "Postman"],
    },
  ], [])
  const [activeTab, setActiveTab] = useState("frontend")

  const principles = useMemo(() => [
    "Every feature should solve a real problem.",
    "Every animation should have a purpose.",
    "Every database should be designed for growth.",
    "Every interface should reduce complexity rather than create it.",
    "Good software disappears into the background and allows users to focus on their goals.",
  ], [])

  const industries = useMemo(() => [
    "Startups", "Educational Institutions", "Small Businesses",
    "Service-Based Companies", "Healthcare", "Event Management",
    "Productivity Platforms", "AI Products", "SaaS Businesses", "Internal Software",
  ], [])

  const specializations = useMemo(() => [
    "Full-Stack Web Development", "SaaS Product Development", "AI-Powered Applications",
    "Business Management Systems", "Dashboard & Admin Panels", "Authentication & Authorization",
    "Database Architecture", "API Development", "Responsive UI/UX", "Performance Optimization",
    "Cloud Deployment", "Technical Consulting",
  ], [])

  // Form state
  type FormState = { name: string; email: string; phone: string; subject: string; description: string }
  const [formData, setFormData] = useState<FormState>({ name: "", email: "", phone: "", subject: "", description: "" })
  const [touched, setTouched] = useState({ name: false, email: false, phone: false, subject: false, description: false })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "whatsapp" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const isNameValid = formData.name.length >= 5 && formData.name.length <= 60 && !XSS_URL_REGEX.test(formData.name)
  const isEmailValid = EMAIL_REGEX.test(formData.email) && !XSS_URL_REGEX.test(formData.email)
  const isPhoneValid = formData.phone.length === 0 || PHONE_REGEX.test(formData.phone)
  const isSubjectValid = formData.subject.length >= 2 && formData.subject.length <= 80 && !XSS_URL_REGEX.test(formData.subject)
  const isDescValid = formData.description.length >= 10 && formData.description.length <= 500 && !XSS_URL_REGEX.test(formData.description)
  const isValid = isNameValid && isEmailValid && isPhoneValid && isSubjectValid && isDescValid

  const handleChange = useCallback((field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  // Retry with exponential backoff
  const submitWithRetry = useCallback(async (data: FormState, retries = 3): Promise<ContactResponse> => {
    let lastError: ContactResponse = { ok: false, error: "Unknown error" }
    for (let attempt = 0; attempt < retries; attempt++) {
      if (attempt > 0) await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 500))
      try {
        const res = await submitContact({
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          description: data.description,
          source: "about",
        })
        if (res.ok) return res
        const errorRes = res as { ok: false; error: string }
        if (errorRes.error?.includes("Too many requests")) return res
        lastError = res
      } catch {
        lastError = { ok: false, error: "Network failure. Please try again." }
      }
    }
    return lastError
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    setIsSubmitting(true)
    setFormStatus("idle")
    setErrorMessage("")

    try {
      const response = await submitWithRetry(formData)
      if (!response.ok) {
        setFormStatus("error")
        setErrorMessage((response as { ok: false; error: string }).error || "Failed to send message.")
        return
      }
      if (response.channel === "email") {
        setFormStatus("success")
        setFormData({ name: "", email: "", phone: "", subject: "", description: "" })
        setTouched({ name: false, email: false, phone: false, subject: false, description: false })
        setTimeout(() => setFormStatus("idle"), 6000)
      } else if (response.channel === "whatsapp" && response.whatsappUrl) {
        setFormStatus("whatsapp")
        setFormData({ name: "", email: "", phone: "", subject: "", description: "" })
        setTouched({ name: false, email: false, phone: false, subject: false, description: false })
        const url = response.whatsappUrl
        setTimeout(() => { window.open(url, "_blank"); setFormStatus("idle") }, 1500)
      }
    } catch {
      setFormStatus("error")
      setErrorMessage("A critical network failure occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const viewportConfig = { once: true, margin: "-100px" }

  return (
    <div className="relative w-full mt-20" style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden" aria-label="About Dario George">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.04)_1px,transparent_1px)] bg-[size:4rem_4rem] z-0 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] z-0 pointer-events-none" />
        {/* Architectural markers */}
        <span className="absolute top-8 left-8 text-foreground/20 font-mono text-xs z-10">+</span>
        <span className="absolute top-8 right-8 text-foreground/20 font-mono text-xs z-10">+</span>
        <span className="absolute bottom-16 left-8 text-foreground/20 font-mono text-xs z-10">+</span>
        <span className="absolute bottom-16 right-8 text-foreground/20 font-mono text-xs z-10">+</span>

        <motion.div
          style={{ y: shouldReduceMotion ? 0 : heroTextY, opacity: shouldReduceMotion ? 1 : heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 mb-10"
          >
            <span className="w-12 h-[1px] bg-accent/60" />
            <span className="font-mono text-xs tracking-[0.4em] text-accent/80 uppercase">Full-Stack Developer · Kerala, India</span>
            <span className="w-12 h-[1px] bg-accent/60" />
          </motion.div>

          {/* Main heading */}
          <h1>
            <span className="sr-only">About Dario George — Full-Stack Web Developer from Kerala, India building modern web applications, AI-powered products, and exceptional digital experiences.</span>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              aria-hidden="true"
            >
              <motion.div variants={wordRevealVariants} className="text-[16vw] md:text-[11vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground">
                DARIO
              </motion.div>

              <motion.div variants={wordRevealVariants} className="text-[16vw] md:text-[11vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground/70">
                GEORGE
              </motion.div>

              <div className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[5vw] font-black leading-tight tracking-tighter uppercase h-[1.5em] w-full relative overflow-hidden flex items-center justify-center px-4 text-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={heroKeywords[heroKeyIndex]}
                    initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 60, rotateX: -45, filter: "blur(20px)" }}
                    animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
                    exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -60, rotateX: 45, filter: "blur(20px)" }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute text-accent"
                    style={{ fontFamily: "var(--font-lobster)", fontStyle: "italic", transformOrigin: "center center -60px", transformStyle: "preserve-3d" }}
                  >
                    {heroKeywords[heroKeyIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

            </motion.div>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 text-foreground/50 text-base md:text-xl max-w-2xl leading-relaxed font-light"
          >
            Building digital products that feel effortless — through thoughtful engineering,
            intuitive design, and technology that feels invisible.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-16 flex flex-col items-center gap-3"
          >
            <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-foreground/30">SCROLL TO EXPLORE</span>
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-[1px] h-12 bg-gradient-to-b from-accent/60 to-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-foreground/30 z-10"
        >
          <MapPin size={12} />
          <span className="font-mono text-[10px] tracking-widest uppercase">Kerala, India · Delhi, India</span>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 2: STORY / BIO
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={bioRef} id="story" className="py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative overflow-hidden" aria-label="Dario George's story">
        {/* Theme-aware grid */}
        {mounted && (
          <div
            className="absolute inset-0 bg-[size:4rem_4rem] z-0 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, ${actualTheme === "dark" ? "rgba(228,214,169,0.025)" : "rgba(153,95,47,0.025)"} 1px, transparent 1px), linear-gradient(to bottom, ${actualTheme === "dark" ? "rgba(228,214,169,0.025)" : "rgba(153,95,47,0.025)"} 1px, transparent 1px)`,
            }}
          />
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="flex flex-col lg:flex-row gap-16 lg:gap-12 relative z-10 w-full"
        >
          {/* Left sticky anchor */}
          <div className="w-full lg:w-5/12 relative">
            <div className="lg:sticky lg:top-40 flex flex-col items-start h-fit">
              <motion.div variants={fadeUpVariants}><BracketLabel>My Story</BracketLabel></motion.div>
              <motion.div variants={fadeUpVariants} style={{ perspective: shouldReduceMotion ? "none" : "1000px" }}>
                <h2 className="text-[12vw] lg:text-[6.5vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground mb-6">
                  THE<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-muted">BUILDER</span>
                </h2>
              </motion.div>
              <motion.p variants={fadeUpVariants} className="text-foreground/50 max-w-sm text-sm md:text-base leading-relaxed mb-8">
                From Kerala, India — operating at the intersection of technical precision and premium design.
              </motion.p>
              <motion.div variants={fadeUpVariants} className="flex flex-col gap-3 mt-4">
                <a href="mailto:mail.dariogeorge@gmail.com" className="group flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors duration-300">
                  <Mail size={14} />
                  <span className="font-mono text-xs tracking-wide">mail.dariogeorge@gmail.com</span>
                </a>
                <a href="https://github.com/dariogeorge21" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors duration-300">
                  <ArrowUpRight size={14} />
                  <span className="font-mono text-xs tracking-wide">github.com/dariogeorge21</span>
                </a>
                <a href="https://linkedin.com/in/dariogeorge21" target="_blank" rel="noreferrer" className="group flex items-center gap-2 text-foreground/40 hover:text-accent transition-colors duration-300">
                  <ArrowUpRight size={14} />
                  <span className="font-mono text-xs tracking-wide">linkedin.com/in/dariogeorge21</span>
                </a>
              </motion.div>
            </div>
          </div>

          {/* Right parallax card */}
          <div className="w-full lg:w-7/12 flex flex-col gap-12 pt-0 lg:pt-16">
            <motion.div
              style={shouldReduceMotion ? {} : { y: bioCardY, rotate: bioCardRotate }}
              variants={fadeUpVariants}
              className="relative z-20 w-full group"
            >
              <span className="absolute -top-3 -left-3 text-foreground/30 font-mono text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -top-3 -right-3 text-foreground/30 font-mono text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-3 -left-3 text-foreground/30 font-mono text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
              <span className="absolute -bottom-3 -right-3 text-foreground/30 font-mono text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity">+</span>

              <BorderGlow
                edgeSensitivity={40}
                glowColor={mounted ? themeColors.glowColor : "228 214 169"}
                backgroundColor={mounted ? themeColors.backgroundColor : "rgba(20, 16, 14, 0.4)"}
                borderRadius={24}
                glowRadius={50}
                glowIntensity={0.7}
                coneSpread={30}
                animated={true}
                colors={mounted ? themeColors.palette : ["#E4D6A9", "#995F2F", "#622B14"]}
              >
                <article className="p-6 sm:p-10 md:p-14 relative backdrop-blur-[12px] h-full rounded-[24px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
                  <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,var(--accent)_1px,transparent_1px)] bg-[length:16px_16px]" />
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">Builder-Oriented</h3>
                      <div className="text-foreground/10"><Code2 size={52} strokeWidth={1.2} /></div>
                    </div>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={viewportConfig}
                      className="space-y-6 text-foreground/75 text-base md:text-lg leading-relaxed font-light"
                    >
                      <motion.p variants={fadeUpVariants}>
                        My journey into software development started with curiosity. What began as experimenting
                        with websites gradually evolved into a passion for understanding how complex digital systems
                        work — from frontend interfaces and backend APIs to databases, authentication systems,
                        cloud infrastructure, and artificial intelligence.
                      </motion.p>
                      <motion.p variants={fadeUpVariants}>
                        Today, I spend countless hours learning, building, researching, and refining my skills to
                        create applications that meet professional standards and deliver meaningful value to users.
                        I enjoy solving challenging technical problems, designing scalable architectures, optimizing
                        performance, and crafting interfaces that people actually enjoy using.
                      </motion.p>
                      <motion.p variants={fadeUpVariants}>
                        I believe great software is not just about writing code — it&apos;s about solving real
                        problems through thoughtful engineering, intuitive design, and technology that feels
                        invisible to the people using it.
                      </motion.p>
                      <motion.p variants={fadeUpVariants} className="font-medium text-foreground/90 italic border-l-2 border-accent pl-4">
                        &ldquo;Build software that is fast, reliable, beautiful, and genuinely useful.&rdquo;
                      </motion.p>
                    </motion.div>
                  </div>
                </article>
              </BorderGlow>
            </motion.div>

            {/* Stats strip */}
            <motion.div variants={fadeUpVariants} className="flex flex-wrap items-center gap-8 pl-2">
              <div className="flex items-center gap-4">
                <div className="w-[1px] h-10 bg-accent/30" />
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/30 uppercase">Active Since</p>
                  <p className="text-xl font-bold text-foreground">2024</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[1px] h-10 bg-foreground/10" />
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/30 uppercase">Based In</p>
                  <p className="text-lg font-semibold text-foreground">Kerala / Delhi</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-[1px] h-10 bg-foreground/10" />
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] text-foreground/30 uppercase">Available</p>
                  <p className="text-lg font-semibold text-green-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />Now
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 3: PHILOSOPHY MANIFESTO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="philosophy" className="py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative border-t border-foreground/10" aria-label="Development philosophy">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div variants={fadeUpVariants}>
              <BracketLabel>Philosophy</BracketLabel>
              <h2 className="text-[10vw] lg:text-[5vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground">
                HOW I<br />
                <span className="text-accent" style={{ fontFamily: "var(--font-lobster)", fontStyle: "italic", fontWeight: "normal" }}>think</span><br />
                &amp; BUILD
              </h2>
            </motion.div>
            <motion.div variants={fadeUpVariants} className="flex items-end">
              <p className="text-foreground/50 text-base md:text-xl leading-relaxed max-w-md font-light">
                I don&apos;t believe in building software simply because it can be built.
                Every decision should serve a purpose, every line of code should earn its place.
              </p>
            </motion.div>
          </div>
          <motion.div variants={staggerContainer} className="max-w-4xl">
            {principles.map((text, i) => <Principle key={i} text={text} index={i} />)}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 4: SPECIALIZATIONS
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="specializations" className="py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative border-t border-foreground/10" aria-label="Areas of specialization">
        <span className="absolute top-0 left-8 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        <span className="absolute top-0 right-8 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={viewportConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <motion.div variants={fadeUpVariants}>
              <BracketLabel>What I Do</BracketLabel>
              <h2 className="text-[8vw] lg:text-[4vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground mb-6">
                AREAS OF<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-muted">EXPERTISE</span>
              </h2>
            </motion.div>
            <motion.p variants={fadeUpVariants} className="text-foreground/50 text-base md:text-lg leading-relaxed max-w-md font-light">
              I specialize in developing modern, scalable web applications for businesses, startups,
              organizations, and individuals. Every application focuses on maintainability, scalability,
              security, and long-term growth.
            </motion.p>
            <motion.div variants={fadeUpVariants} className="mt-10">
              <a href="#contact" className="group relative inline-flex items-center gap-3 px-6 py-3 border border-foreground/20 text-foreground/70 font-mono text-sm tracking-widest uppercase hover:border-accent hover:text-accent transition-all duration-500">
                Start a Project
                <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </motion.div>
          </div>
          <motion.div variants={staggerContainer} className="flex flex-wrap gap-3 content-start">
            {specializations.map(s => <TechTag key={s} label={s} />)}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 5: TECHNICAL EXPERTISE — Tabbed
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="expertise" className="py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative border-t border-foreground/10" aria-label="Technical expertise">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          <motion.div variants={fadeUpVariants} className="mb-12">
            <BracketLabel>Technical Expertise</BracketLabel>
            <h2 className="text-[8vw] lg:text-[4.5vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground">
              MY TECH<br /><span className="text-accent">ARSENAL</span>
            </h2>
          </motion.div>
          {/* Tab navigation */}
          <motion.div variants={fadeUpVariants} className="flex flex-wrap gap-2 mb-10 border-b border-foreground/10 pb-4">
            {techCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`group flex items-center gap-2 px-4 py-2 font-mono text-xs tracking-widest uppercase transition-all duration-300 border-b-2 -mb-[18px] ${activeTab === cat.id ? "border-accent text-accent" : "border-transparent text-foreground/40 hover:text-foreground/70 hover:border-foreground/20"}`}
              >
                <span className={`transition-colors duration-300 ${activeTab === cat.id ? "text-accent" : "text-foreground/30 group-hover:text-foreground/60"}`}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </motion.div>
          {/* Active tab content */}
          <AnimatePresence mode="wait">
            {techCategories.map(cat => cat.id === activeTab ? (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex flex-wrap gap-3">
                  {cat.techs.map(tech => <TechTag key={tech} label={tech} />)}
                </motion.div>
              </motion.div>
            ) : null)}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 6: INDUSTRIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="industries" className="py-16 sm:py-24 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative border-t border-foreground/10" aria-label="Industries served">
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={viewportConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <motion.div variants={fadeUpVariants}>
            <BracketLabel>Industries</BracketLabel>
            <h2 className="text-[8vw] lg:text-[4vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground mb-4">
              WHO I<br />WORK WITH
            </h2>
            <p className="text-foreground/50 text-base md:text-lg leading-relaxed max-w-md font-light mt-6">
              From landing pages to enterprise dashboards, I focus on creating digital products that
              scale with business growth across a wide range of industries.
            </p>
          </motion.div>
          <motion.div variants={staggerContainer} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {industries.map((industry, i) => (
              <motion.div
                key={industry}
                variants={tagVariant}
                whileHover={{ scale: 1.03, transition: { type: "spring", stiffness: 400, damping: 20 } }}
                className="group relative flex items-center gap-3 p-4 border border-foreground/10 bg-surface/5 backdrop-blur-sm hover:border-accent/40 transition-all duration-300"
              >
                <motion.div className="absolute inset-0 bg-accent/5" initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                <span className="font-mono text-[10px] text-foreground/20 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm font-medium text-foreground/60 group-hover:text-foreground/90 transition-colors duration-300 leading-tight relative z-10">{industry}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SECTION 7: CONTACT FORM
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative border-t border-foreground/10" aria-label="Contact Dario George">
        <span className="absolute top-0 left-8 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        <span className="absolute top-0 right-8 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={viewportConfig} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* Left CTA */}
          <motion.div variants={fadeUpVariants} className="flex flex-col justify-center gap-8">
            <div>
              <BracketLabel>Let&apos;s Connect</BracketLabel>
              <h2 className="flex flex-col gap-1 font-bold text-foreground tracking-tight leading-tight">
                <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold">Let&apos;s</span>
                <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold">build</span>
                <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-accent font-normal" style={{ fontFamily: "var(--font-lobster)", fontStyle: "italic" }}>something</span>
                <span className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold pb-2">great</span>
              </h2>
            </div>
            <div className="border-t border-foreground/10 pt-8 flex flex-col gap-4">
              <p className="font-mono text-xs tracking-widest uppercase text-foreground/40 mb-2">Direct contact</p>
              <a href="mailto:mail.dariogeorge@gmail.com" className="group relative inline-flex items-center text-foreground text-lg md:text-2xl font-bold pb-2 overflow-hidden w-fit">
                <span className="absolute left-0 bottom-0 w-full h-[1px] bg-foreground/20" />
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-accent origin-left scale-x-0 transition-transform duration-[2000ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:scale-x-100" />
                <span className="flex items-center gap-2">
                  <Mail size={18} className="text-foreground/40 group-hover:text-accent transition-colors duration-500" />
                  <span className="group-hover:text-accent transition-colors duration-500">mail.dariogeorge@gmail.com</span>
                  <ArrowUpRight size={18} className="text-accent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                </span>
              </a>
              <div className="mt-4 space-y-1">
                <p className="font-mono text-xs tracking-widest uppercase text-foreground/30">Response time</p>
                <p className="text-foreground/50 text-sm">Typically within 24 hours</p>
              </div>
            </div>
          </motion.div>

          {/* Right Glass Form */}
          <motion.div variants={fadeUpVariants} className="flex justify-end relative">
            <span className="absolute -top-4 -right-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>
            <span className="absolute -bottom-4 -left-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>

            <motion.div
              ref={formRef}
              onMouseMove={handleFormMouseMove}
              onMouseLeave={handleFormMouseLeave}
              style={{ rotateX: shouldReduceMotion ? 0 : formRotateX, rotateY: shouldReduceMotion ? 0 : formRotateY }}
              className="w-full max-w-lg bg-surface/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 md:p-12 relative overflow-hidden shadow-2xl will-change-transform"
            >
              <motion.div className="absolute pointer-events-none inset-0 z-0" style={{ background: glowPosition }} />

              <div className="relative z-10">
                <h3 className="font-mono text-3xl tracking-[0.3em] uppercase text-foreground/80 mb-10 border-b border-white/10 pb-4 inline-block">
                  CONTACT
                </h3>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                  <AnimatedInput id="about-name" label="Full Name" value={formData.name} onChange={handleChange("name")}
                    maxLength={60} isInvalid={touched.name && !isNameValid} isValidField={touched.name && isNameValid}
                    autoComplete="name" />

                  <AnimatedInput id="about-email" label="Email Address" type="email" value={formData.email} onChange={handleChange("email")}
                    isInvalid={touched.email && !isEmailValid} isValidField={touched.email && isEmailValid}
                    autoComplete="email" />

                  <AnimatedInput id="about-phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange("phone")}
                    isInvalid={touched.phone && !isPhoneValid}
                    isValidField={touched.phone && formData.phone.length > 0 && isPhoneValid}
                    autoComplete="tel" />

                  <AnimatedInput id="about-subject" label="Message Subject" value={formData.subject} onChange={handleChange("subject")}
                    maxLength={80} isInvalid={touched.subject && !isSubjectValid} isValidField={touched.subject && isSubjectValid}
                  />

                  <AnimatedInput id="about-description" label="Message" value={formData.description} onChange={handleChange("description")}
                    isTextArea={true} maxLength={500} isInvalid={touched.description && !isDescValid}
                    isValidField={touched.description && isDescValid}
                  />

                  {/* Error */}
                  <AnimatePresence>
                    {formStatus === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="flex items-start gap-3 text-red-500 font-mono text-sm tracking-wide p-4 bg-red-500/10 border border-red-500/20"
                        role="alert"
                      >
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>[ERROR]: {errorMessage}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Validation hints */}
                  <AnimatePresence>
                    {!isValid && Object.values(touched).some(Boolean) && formStatus !== "error" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="font-mono text-xs text-foreground/30 space-y-1">
                        {touched.name && !isNameValid && <p className="text-red-500/70">· Name must be 5–60 characters without URLs</p>}
                        {touched.email && !isEmailValid && <p className="text-red-500/70">· Please enter a valid email address</p>}
                        {touched.phone && !isPhoneValid && <p className="text-red-500/70">· Phone number format is invalid</p>}
                        {touched.subject && !isSubjectValid && <p className="text-red-500/70">· Subject must be 2–80 characters</p>}
                        {touched.description && !isDescValid && <p className="text-red-500/70">· Message must be 10–500 characters</p>}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit / Status area */}
                  <div className="min-h-[64px] flex items-end justify-between mt-2 gap-4">
                    <AnimatePresence mode="wait">
                      {formStatus === "success" ? (
                        <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="flex items-center gap-3 text-green-500 font-mono uppercase tracking-widest text-xs px-6 py-4 border border-green-500/30 bg-green-500/10 w-full" role="status">
                          <CheckCircle size={16} />
                          Transmission Successful — I&apos;ll be in touch!
                        </motion.div>
                      ) : formStatus === "whatsapp" ? (
                        <motion.div key="whatsapp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                          className="text-yellow-400 font-mono uppercase tracking-widest text-xs flex items-center gap-3 px-6 py-4 border border-yellow-400/30 bg-yellow-400/10 w-full" role="status">
                          ↗ Opening WhatsApp fallback…
                        </motion.div>
                      ) : (
                        <motion.div key="form-footer" className="flex items-center justify-between w-full gap-4">
                          <span className="font-mono text-[10px] text-foreground/20">
                            {formData.description.length > 0 ? `${formData.description.length}/500` : ""}
                          </span>
                          <AnimatePresence mode="wait">
                            {isSubmitting ? (
                              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-3 font-mono text-sm tracking-widest uppercase text-foreground/50">
                                <Loader2 size={16} className="animate-spin" />Transmitting…
                              </motion.div>
                            ) : isValid ? (
                              <motion.button key="submit"
                                initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                type="submit" disabled={isSubmitting}
                                className="group relative flex items-center gap-3 bg-foreground text-background px-6 py-3 font-medium tracking-widest uppercase text-sm border border-transparent hover:bg-transparent hover:text-foreground hover:border-foreground transition-colors duration-300 disabled:opacity-75 disabled:cursor-wait"
                              >
                                Send Message
                                <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1" />
                              </motion.button>
                            ) : (
                              <motion.span key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="font-mono text-[10px] text-foreground/25 tracking-wide">
                                Fill all required fields to send
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom socials strip */}
        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mt-24 pt-16 border-t border-foreground/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div>
            <p className="font-mono text-xs tracking-[0.3em] text-foreground/30 uppercase mb-3">[ Also find me on ]</p>
            <div className="flex flex-wrap gap-6">
              {[
                { label: "LinkedIn", href: "https://linkedin.com/in/dariogeorge21" },
                { label: "GitHub", href: "https://github.com/dariogeorge21" },
                { label: "Portfolio", href: "https://portfolio.dariogeorge.in" },
              ].map(link => (
                <a key={link.label} href={link.href} target="_blank" rel="noreferrer"
                  className="group relative flex items-center gap-1.5 text-sm font-medium text-foreground/50 hover:text-foreground transition-colors duration-300">
                  {link.label}
                  <ArrowUpRight size={12} className="transform transition-transform duration-300 group-hover:rotate-12 group-hover:text-accent" />
                  <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-foreground scale-x-0 origin-right transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:scale-x-100 group-hover:origin-left" />
                </a>
              ))}
            </div>
          </div>
          <p className="text-foreground/30 text-sm font-light max-w-xs">
            Based in Kerala &amp; Delhi. Available for remote projects across India and worldwide.
          </p>
        </motion.div>
      </section>
    </div>
  )
}
