"use client"

import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, useTransform, useReducedMotion } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowRight, ArrowUpRight, Mail } from "lucide-react"
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa"
import { submitContact, type ContactResponse } from "@/app/actions/contact"

// --- TYPES & VALIDATION ---
type FormState = {
  name: string
  email: string
  subject: string
  description: string
}

const XSS_URL_REGEX = /(https?:\/\/[^\s]+|<[^>]*>)/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- ANIMATED INPUT WITH LAYOUT SMOOTHING ---
const AnimatedInput = ({ 
  label, 
  value, 
  onChange,
  isTextArea = false, 
  isInvalid = false,
  isValidField = false,
  ...props 
}: { 
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  isTextArea?: boolean
  isInvalid?: boolean
  isValidField?: boolean
  [key: string]: any 
}) => {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const inputRef = useRef<any>(null)

  return (
    <motion.div 
      className={`group relative flex flex-col justify-end min-h-[4rem] border-b pb-3 cursor-text transition-colors hover:border-foreground/30 ${
        isInvalid ? 'border-red-500' : isValidField ? 'border-green-500' : 'border-foreground/10'
      }`}
      onClick={() => inputRef.current?.focus()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex items-end gap-3 w-full">
        <span className={`font-mono text-sm md:text-base uppercase tracking-widest transition-all duration-300 ${
          isInvalid ? 'text-red-500' : isValidField ? 'text-green-500' : active ? 'text-accent' : 'text-foreground/60'
        }`}>
          {label}{active ? ':' : ''}
        </span>
        
        {!active && (
          <div className={`h-[2px] w-8 transition-opacity duration-300 group-hover:opacity-30 group-hover:animate-pulse ${
            isInvalid ? 'bg-red-500' : isValidField ? 'bg-green-500' : 'bg-foreground/40'
          }`} />
        )}

        {isTextArea ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`bg-transparent outline-none flex-1 text-xl md:text-2xl transition-all duration-300 resize-none overflow-hidden h-8 md:h-10 leading-tight ${
              isInvalid ? 'text-red-500' : isValidField ? 'text-green-500' : 'text-foreground'
            } ${active ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
            {...props}
          />
        ) : (
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`bg-transparent outline-none flex-1 text-xl md:text-2xl transition-all duration-300 h-8 md:h-10 leading-tight ${
              isInvalid ? 'text-red-500' : isValidField ? 'text-green-500' : 'text-foreground'
            } ${active ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
            {...props}
          />
        )}
      </div>

      <motion.span 
        layoutId={`underline-${label}`}
        className={`absolute bottom-0 left-0 w-full h-[2px] origin-left ${isInvalid ? 'bg-red-500' : isValidField ? 'bg-green-500' : 'bg-accent'}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: active ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      />
    </motion.div>
  )
}

// --- 3D GLASS SOCIAL CARD (Physics-based, no raw CSS) ---
const SocialCard = ({ href, icon: Icon, label, color }: { href: string; icon: any; label: string; color: string }) => {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-50, 50], [5, -5]), { stiffness: 300, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-50, 50], [-5, 5]), { stiffness: 300, damping: 20 })
  const shadowX = useSpring(useTransform(x, [-50, 50], [-10, 10]), { stiffness: 300, damping: 20 })
  const shadowY = useSpring(useTransform(y, [-50, 50], [10, 20]), { stiffness: 300, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    x.set(distanceX)
    y.set(distanceY)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return (
    <motion.a
      ref={cardRef}
      href={href}
      target="_blank"
      rel="noreferrer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        boxShadow: useMotionTemplate`${shadowX}px ${shadowY}px 20px rgba(0,0,0,0.3)`,
      }}
      whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 15 } }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center gap-4 px-6 py-3 rounded-sm backdrop-blur-md border border-white/10 overflow-hidden w-full md:w-auto justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <Icon size={28} className="text-foreground/80 group-hover:text-white transition-colors duration-300" />
      <span className="font-mono text-sm uppercase tracking-widest font-medium text-foreground/60 group-hover:text-white">
        {label}
      </span>
    </motion.a>
  )
}

// --- MAIN CONTACT COMPONENT ---
export default function Contact() {
  const keyWords = ["impact", "stories", "future"]
  const [currentKeyWordIndex, setCurrentKeyWordIndex] = useState(0)
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, description: false })
  const [shakeKey, setShakeKey] = useState(0)
  const [formData, setFormData] = useState<FormState>({ name: "", email: "", subject: "", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "whatsapp" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const shouldReduceMotion = useReducedMotion()

  // Form Validation
  const isNameValid = formData.name.length >= 5 && formData.name.length <= 30 && !XSS_URL_REGEX.test(formData.name)
  const isEmailValid = EMAIL_REGEX.test(formData.email) && !XSS_URL_REGEX.test(formData.email)
  const isSubjectValid = formData.subject.length >= 4 && formData.subject.length <= 30 && !XSS_URL_REGEX.test(formData.subject)
  const isDescValid = formData.description.length >= 10 && formData.description.length <= 100 && !XSS_URL_REGEX.test(formData.description)
  const isValid = isNameValid && isEmailValid && isSubjectValid && isDescValid

  // --- GPU ACCELERATED MOUSE TRACKING FOR FORM GLOW & TILT ---
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 })
  const formRef = useRef<HTMLDivElement>(null)

  // Form tilt based on cursor position (max ±2deg)
  const rotateX = useTransform(smoothMouseY, [0, 500], [2, -2])
  const rotateY = useTransform(smoothMouseX, [0, 500], [-2, 2])
  const glowPosition = useMotionTemplate`radial-gradient(circle 300px at ${smoothMouseX}px ${smoothMouseY}px, rgba(255,255,255,0.08), transparent 80%)`

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!formRef.current) return
    const rect = formRef.current.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  // --- KEYWORD ROTATION (with reduced motion fallback)---
  useEffect(() => {
    if (shouldReduceMotion) return
    const interval = setInterval(() => {
      setCurrentKeyWordIndex((prev) => (prev + 1) % keyWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [keyWords.length, shouldReduceMotion])

  // --- FORM HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof FormState) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setTouched(prev => ({ ...prev, [field]: true }))
    setShakeKey(prev => prev + 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return

    setIsSubmitting(true)
    setFormStatus("idle")
    setErrorMessage("")
    setWhatsappUrl("")

    try {
      const response: ContactResponse = await submitContact({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        description: formData.description,
        source: "landing",
      })

      if (!response.ok) {
        setFormStatus("error")
        setErrorMessage(response.error || "Failed to send message")
        return
      }

      // Primary path — email delivered via Resend
      if (response.channel === "email") {
        setFormStatus("success")
        setFormData({ name: "", email: "", subject: "", description: "" })
        setTouched({ name: false, email: false, subject: false, description: false })
        setTimeout(() => setFormStatus("idle"), 4000)
        return
      }

      // Fallback path — open WhatsApp
      if (response.channel === "whatsapp" && response.whatsappUrl) {
        setWhatsappUrl(response.whatsappUrl)
        setFormStatus("whatsapp")
        setFormData({ name: "", email: "", subject: "", description: "" })
        setTouched({ name: false, email: false, subject: false, description: false })
        setTimeout(() => {
          window.open(response.whatsappUrl, "_blank")
          setFormStatus("idle")
        }, 1500)
      }
    } catch (err) {
      setFormStatus("error")
      setErrorMessage("A critical network failure occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- ANIMATION VARIANTS (Staggered reveals)---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  } as const

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  } as const

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
  } as const

  const wordVariants = {
    hidden: { opacity: 0, y: 30, clipPath: "inset(0 0 100% 0)" },
    visible: { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  } as const

  const socialCardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateX: 15 },
    visible: { opacity: 1, scale: 1, rotateX: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
  } as const

  return (
    <motion.section
      id="contact"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="py-16 sm:py-24 md:py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative"
      style={{ fontFamily: "var(--font-google-sans-flex)" }}
    >
     
      {/* --- INJECTED 3D GLASSMORPHIC SOCIAL CARDS CSS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card {
          position: relative;
          display: inline-flex;
          width: 260px;
          height: 80px;
          background: #fff;
          text-decoration: none;
          padding-left: 20px;
          transform: rotate(-30deg) skew(25deg) translate(0, 0);
          transition: all 0.5s;
          box-shadow: -20px 20px 10px rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          top: 10px;
          left: -20px;
          height: 100%;
          width: 20px;
          background: #b1b1b1;
          transform: rotate(0deg) skewY(-45deg);
          transition: all 0.5s;
        }
        .glass-card::after {
          content: '';
          position: absolute;
          bottom: -20px;
          left: -10px;
          height: 20px;
          width: 100%;
          background: #b1b1b1;
          transform: rotate(0deg) skewX(-45deg);
          transition: all 0.5s;
        }
        .glass-card:hover {
          transform: rotate(-30deg) skew(25deg) translate(20px, -15px);
          box-shadow: -50px 50px 50px rgba(0, 0, 0, 0.5);
        }
        .glass-card-icon {
          font-size: 60px;
          color: #262626;
          padding-top: 10px;
          line-height: 80px;
          transition: all 0.5s;
          padding-right: 14px;
          display: inline-block;
        }
        .glass-card:hover .glass-card-icon {
          color: #fff;
        }
        .glass-card-name {
          padding: 0;
          margin: 0;
          position: absolute;
          top: 16px;
          font-family: var(--font-funnel-display);
          left: 76px;
          color: #262626;
          letter-spacing: 4px;
          transition: all 0.5s;
          font-weight: 1000;
          font-size: 24px;
        }
        .glass-card:hover .glass-card-name {
          color: #fff;
        }
        /* LinkedIn */
        .glass-card.linkedin:hover {
          background: #0077b5;
        }
        .glass-card.linkedin:hover::before {
          background: #005a87;
        }
        .glass-card.linkedin:hover::after {
          background: #0099e0;
        }
        /* GitHub */
        .glass-card.github:hover {
          background: #333;
        }
        .glass-card.github:hover::before {
          background: #1a1a1a;
        }
        .glass-card.github:hover::after {
          background: #666;
        }
        /* Twitter */
        .glass-card.twitter:hover {
          background: #00aced;
        }
        .glass-card.twitter:hover::before {
          background: #097aa5;
        }
        .glass-card.twitter:hover::after {
          background: #53b9e0;
        }
        /* Instagram */
        .glass-card.instagram:hover {
          background: #e4405f;
        }
        .glass-card.instagram:hover::before {
          background: #d81c3f;
        }
        .glass-card.instagram:hover::after {
          background: #e46880;
        }
        /* Email */
        .glass-card.email:hover {
          background: #ea4335;
        }
        .glass-card.email:hover::before {
          background: #c5221f;
        }
        .glass-card.email:hover::after {
          background: #f28482;
        }
        
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1) translate(0, 0); filter: drop-shadow(0 0 0px rgba(96, 165, 250, 0)); }
          50% { transform: scale(1.15) translate(3px, -3px); filter: drop-shadow(0 0 12px rgba(96, 165, 250, 0.8)); }
        }
        .animate-pulse-scale {
          animation: pulse-scale 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          animation-delay: 1.5s;
        }
      `}} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-8 mb-24 sm:mb-32">
        
        {/* === COLUMN 1: INTERACTIVE TYPOGRAPHY (Staggered words) === */}
        <motion.div variants={leftColumnVariants} className="flex flex-col justify-center gap-y-8">
          <h2 className="flex flex-col gap-y-2 font-bold text-foreground tracking-tight leading-tight">
            <motion.span variants={wordVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-foreground tracking-tight leading-tight">
              Let's
            </motion.span>
            <motion.span variants={wordVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-foreground tracking-tight leading-tight">
              create
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentKeyWordIndex}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                transition={{ duration: 0.5 }}
                className="font-lobster italic text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-accent font-normal tracking-tight leading-tight"
              >
                {keyWords[currentKeyWordIndex]}
              </motion.span>
            </AnimatePresence>
            <motion.span variants={wordVariants} className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-bold text-foreground tracking-tight leading-tight pb-2">
              together
            </motion.span>
          </h2>
          <div className="mt-12 pt-8 border-t border-foreground/20">
            <p className="text-foreground/60 font-mono text-xs tracking-widest uppercase mb-3">Contact us</p>
            <a 
              href="mailto:contact@dariogeorge.in" 
              className="group relative inline-flex items-center text-foreground text-2xl md:text-4xl font-bold pb-2 overflow-hidden"
            >
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-foreground/20" />
              <span className="absolute left-0 bottom-0 w-full h-[4px] bg-accent origin-left scale-x-0 transition-transform duration-[2000ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:scale-x-100" />
              <span className="flex items-center overflow-hidden">
                <span className="inline-flex items-center overflow-hidden max-w-0 opacity-0 group-hover:max-w-[400px] group-hover:opacity-100 transition-all duration-[2000ms] ease-[cubic-bezier(0.85,0,0.15,1)] whitespace-nowrap text-accent">
                  <span className="pr-3">Email:</span>
                </span>
                <span className="transition-colors duration-[2000ms] ease-[cubic-bezier(0.85,0,0.15,1)] group-hover:text-accent">
                  contact@dariogeorge.in
                </span>
                <span className="inline-flex items-center mr-5 justify-center opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-4 transition-all duration-[2000ms] ease-[cubic-bezier(0.85,0,0.15,1)] whitespace-nowrap">
                  <ArrowUpRight size={36} strokeWidth={3} className="text-accent" />
                </span>
              </span>
            </a>
          </div>
        </motion.div>

        {/* === COLUMN 2: GLASS FORM WITH PHYSICS TILT === */}
        <motion.div variants={rightColumnVariants} className="flex justify-end relative">
          <span className="absolute -top-4 -right-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>
          <span className="absolute -bottom-4 -left-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>

          <motion.div 
            ref={formRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX: shouldReduceMotion ? 0 : rotateX, rotateY: shouldReduceMotion ? 0 : rotateY }}
            className="w-full max-w-lg bg-surface/5 backdrop-blur-xl border border-white/10 p-5 sm:p-8 md:p-14 relative overflow-hidden shadow-2xl will-change-transform"
          >
            {/* Dynamic Mouse Tracking Glow (GPU accelerated) */}
            <motion.div 
              className="absolute pointer-events-none inset-0 z-0"
              style={{ background: glowPosition }}
            />

            <div className="relative z-10">
              <h3 className="font-google-sans-flex text-4xl tracking-[0.3em] uppercase text-foreground/80 mb-12 border-b border-white/10 pb-4 inline-block">
                CONTACT
              </h3>

              <motion.form 
                onSubmit={handleSubmit} 
                className="flex flex-col gap-10"
                animate={shakeKey > 0 ? { x: shakeKey % 2 === 0 ? [-3, 3, -1, 1, 0] : [3, -3, 1, -1, 0] } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedInput 
                  label="Name" 
                  value={formData.name} 
                  onChange={(e) => handleChange(e, 'name')}
                  maxLength={30}
                  isInvalid={touched.name && !isNameValid}
                  isValidField={touched.name && isNameValid}
                />
                <AnimatedInput 
                  label="Email" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => handleChange(e, 'email')}
                  isInvalid={touched.email && !isEmailValid}
                  isValidField={touched.email && isEmailValid}
                />
                <AnimatedInput 
                  label="Subject" 
                  value={formData.subject} 
                  onChange={(e) => handleChange(e, 'subject')}
                  maxLength={30}
                  isInvalid={touched.subject && !isSubjectValid}
                  isValidField={touched.subject && isSubjectValid}
                />
                <AnimatedInput 
                  label="Description" 
                  value={formData.description} 
                  onChange={(e) => handleChange(e, 'description')}
                  isTextArea={true}
                  maxLength={100}
                  isInvalid={touched.description && !isDescValid}
                  isValidField={touched.description && isDescValid}
                />

                <AnimatePresence>
                  {formStatus === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 font-mono text-sm tracking-wide p-4 bg-red-500/10 border border-red-500/20"
                    >
                      [ERROR]: {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="min-h-[60px] flex items-end justify-end mt-4">
                  <AnimatePresence mode="wait">
                    {formStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-green-500 font-mono uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 border border-green-500/30 bg-green-500/10"
                      >
                        ✓ Transmission Successful
                      </motion.div>
                    ) : formStatus === "whatsapp" ? (
                      <motion.div
                        key="whatsapp"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-yellow-400 font-mono uppercase tracking-widest text-xs flex items-center gap-3 px-6 py-4 border border-yellow-400/30 bg-yellow-400/10"
                      >
                        ↗ Opening WhatsApp fallback…
                      </motion.div>
                    ) : isValid ? (
                      <motion.button
                        key="button"
                        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        disabled={isSubmitting}
                        className="group relative flex items-center gap-4 bg-foreground text-background px-8 py-4 font-medium tracking-widest uppercase text-sm border border-transparent hover:bg-transparent hover:text-foreground hover:border-foreground transition-colors duration-300 disabled:opacity-75 disabled:cursor-wait"
                      >
                        {isSubmitting ? "Transmitting..." : "Send"}
                        <ArrowRight size={16} className={`transform transition-transform duration-300 ${isSubmitting ? 'translate-x-2 animate-pulse' : 'group-hover:translate-x-2'}`} />
                      </motion.button>
                    ) : null}
                  </AnimatePresence>
                </div>
              </motion.form>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* === ROW 2: 3D PHYSICS SOCIAL CARDS (Staggered) === */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="w-full border-t border-foreground/10 pt-24 pb-12 mt-12 relative"
      >
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        
        {/* Social cards: flex-col on mobile (flat via globals.css @media), flex-wrap on desktop */}
        <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between items-stretch md:items-center gap-3 md:gap-12 max-w-9xl mx-auto px-4 md:px-0" style={{ perspective: "1200px" }}>
          
          <a href="https://linkedin.com/in/dariogeorge21" target="_blank" rel="noreferrer" className="glass-card linkedin">
            <FaLinkedin className="glass-card-icon" />
            <span className="glass-card-name">LinkedIn</span>
          </a>

          <a href="https://github.com/dariogeorge21" target="_blank" rel="noreferrer" className="glass-card github">
            <FaGithub className="glass-card-icon" />
            <span className="glass-card-name">GitHub</span>
          </a>

          <a href="https://twitter.com/dariogeorge21" target="_blank" rel="noreferrer" className="glass-card twitter">
            <FaTwitter className="glass-card-icon" />
            <span className="glass-card-name">Twitter</span>
          </a>

          <a href="https://instagram.com/dariogeorge21" target="_blank" rel="noreferrer" className="glass-card instagram">
            <FaInstagram className="glass-card-icon" />
            <span className="glass-card-name">Instagram</span>
          </a>
        </div>
      </motion.div>
    </motion.section>
  )
}