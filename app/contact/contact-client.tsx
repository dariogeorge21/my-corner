"use client"

import { motion, AnimatePresence, useMotionValue, useSpring, useMotionTemplate, useTransform, useReducedMotion } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"
import { ArrowRight, Mail } from "lucide-react"
import { FaLinkedin, FaGithub, FaInstagram, FaMailBulk } from "react-icons/fa"
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

// --- ANIMATED INPUT ---
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
      className={`group relative flex flex-col justify-end min-h-[4rem] border-b pb-3 cursor-text transition-colors hover:border-foreground/30 ${isInvalid ? 'border-red-500' : isValidField ? 'border-green-500' : 'border-foreground/10'
        }`}
      onClick={() => inputRef.current?.focus()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
    >
      <div className="flex items-end gap-3 w-full">
        <span className={`font-mono text-sm md:text-base uppercase tracking-widest transition-all duration-300 ${isInvalid ? 'text-red-500' : isValidField ? 'text-green-500' : active ? 'text-accent' : 'text-foreground/60'
          }`}>
          {label}{active ? ':' : ''}
        </span>

        {!active && (
          <div className={`h-[2px] w-8 transition-opacity duration-300 group-hover:opacity-30 group-hover:animate-pulse ${isInvalid ? 'bg-red-500' : isValidField ? 'bg-green-500' : 'bg-foreground/40'
            }`} />
        )}

        {isTextArea ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`bg-transparent outline-none flex-1 text-xl md:text-2xl transition-all duration-300 resize-none overflow-hidden h-8 md:h-10 leading-tight ${isInvalid ? 'text-red-500' : isValidField ? 'text-green-500' : 'text-foreground'
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
            className={`bg-transparent outline-none flex-1 text-xl md:text-2xl transition-all duration-300 h-8 md:h-10 leading-tight ${isInvalid ? 'text-red-500' : isValidField ? 'text-green-500' : 'text-foreground'
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

// --- MAIN PAGE COMPONENT ---
export default function ContactClient() {
  const [touched, setTouched] = useState({ name: false, email: false, subject: false, description: false })
  const [shakeKey, setShakeKey] = useState(0)
  const [formData, setFormData] = useState<FormState>({ name: "", email: "", subject: "", description: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "whatsapp" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [whatsappUrl, setWhatsappUrl] = useState("")
  const shouldReduceMotion = useReducedMotion()

  // Form Validation
  const isNameValid = formData.name.length >= 5 && formData.name.length <= 60 && !XSS_URL_REGEX.test(formData.name)
  const isEmailValid = EMAIL_REGEX.test(formData.email) && !XSS_URL_REGEX.test(formData.email)
  const isSubjectValid = formData.subject.length >= 2 && formData.subject.length <= 80 && !XSS_URL_REGEX.test(formData.subject)
  const isDescValid = formData.description.length >= 10 && formData.description.length <= 500 && !XSS_URL_REGEX.test(formData.description)
  const isValid = isNameValid && isEmailValid && isSubjectValid && isDescValid

  // --- GPU ACCELERATED MOUSE TRACKING FOR FORM GLOW & TILT ---
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothMouseX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 })
  const smoothMouseY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 })
  const formRef = useRef<HTMLDivElement>(null)

  const rotateX = useTransform(smoothMouseY, [0, 500], [2, -2])
  const rotateY = useTransform(smoothMouseX, [0, 500], [-2, 2])
  const glowPosition = useMotionTemplate`radial-gradient(circle 300px at ${smoothMouseX}px ${smoothMouseY}px, rgba(255,255,255,0.06), transparent 80%)`

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
        source: "about",
      })

      if (!response.ok) {
        setFormStatus("error")
        setErrorMessage(response.error || "Failed to send message")
        return
      }

      if (response.channel === "email") {
        setFormStatus("success")
        setFormData({ name: "", email: "", subject: "", description: "" })
        setTouched({ name: false, email: false, subject: false, description: false })
        setTimeout(() => setFormStatus("idle"), 4000)
        return
      }

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

  // --- ANIMATION VARIANTS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
  } as const

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  } as const

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 } },
  } as const

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen pt-32 pb-16 px-6 md:px-12 max-w-[1800px] mx-auto w-full relative flex items-center"
      style={{ fontFamily: "var(--font-google-sans-flex)" }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        .glass-card {
          position: relative;
          display: inline-flex;
          width: 100%;
          max-width: 280px;
          height: 70px;
          background: #fff;
          text-decoration: none;
          padding-left: 20px;
          transform: rotate(-30deg) skew(25deg) translate(0, 0);
          transition: all 0.5s;
          box-shadow: -15px 15px 10px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          margin: 10px;
        }
        .glass-card::before {
          content: '';
          position: absolute;
          top: 8px;
          left: -16px;
          height: 100%;
          width: 16px;
          background: #b1b1b1;
          transform: rotate(0deg) skewY(-45deg);
          transition: all 0.5s;
        }
        .glass-card::after {
          content: '';
          position: absolute;
          bottom: -16px;
          left: -8px;
          height: 16px;
          width: 100%;
          background: #b1b1b1;
          transform: rotate(0deg) skewX(-45deg);
          transition: all 0.5s;
        }
        .glass-card:hover {
          transform: rotate(-30deg) skew(25deg) translate(15px, -10px);
          box-shadow: -40px 40px 40px rgba(0, 0, 0, 0.4);
        }
        .glass-card-icon {
          font-size: 50px;
          color: #262626;
          padding-top: 10px;
          line-height: 70px;
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
          top: 20px;
          font-family: var(--font-funnel-display);
          left: 70px;
          color: #262626;
          letter-spacing: 3px;
          transition: all 0.5s;
          font-weight: 800;
          font-size: 18px;
          text-transform: uppercase;
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
      `}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 w-full pt-8">

        {/* === COLUMN 1: BIO & SOCIAL LINKS === */}
        <motion.div variants={leftColumnVariants} className="flex flex-col justify-center gap-y-12 h-full">
          <div className="max-w-xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-foreground tracking-tight leading-none mb-6">
              Let's <span className="font-lobster text-accent italic font-normal">Connect.</span>
            </h1>

            <div className="space-y-6 text-foreground/80 text-lg md:text-xl font-medium leading-relaxed">
              <p>
                I'm <strong className="text-foreground">Dario George</strong> — a full-stack web developer from Kerala, India, passionate about building modern web applications, AI-powered products, and exceptional digital experiences.
              </p>
              <p>
                Whether you're launching a startup, modernizing an existing platform, or developing a custom business solution, my goal remains the same:
              </p>
              <p className="font-mono text-accent uppercase tracking-widest text-sm md:text-base border-l-2 border-accent pl-4">
                Build software that is fast, reliable, beautiful, and genuinely useful.
              </p>
            </div>
          </div>

          <div className="pt-8 mx-12 border-t border-foreground/10 flex flex-wrap gap-x-8 gap-y-10 lg:gap-x-12 perspective-[1000px]">
            <a href="https://www.linkedin.com/in/dariogeorge21/" target="_blank" rel="noreferrer" className="glass-card linkedin">
              <FaLinkedin className="glass-card-icon" />
              <span className="glass-card-name">LinkedIn</span>
            </a>

            <a href="https://github.com/dariogeorge21" target="_blank" rel="noreferrer" className="glass-card github">
              <FaGithub className="glass-card-icon" />
              <span className="glass-card-name">GitHub</span>
            </a>

            <a href="https://instagram.com/dariogeorge21" target="_blank" rel="noreferrer" className="glass-card instagram">
              <FaInstagram className="glass-card-icon" />
              <span className="glass-card-name">Instagram</span>
            </a>

            <a href="mailto:mail.dariogeorge@gmail.com" className="glass-card email">
              <FaMailBulk className="glass-card-icon" />
              <span className="glass-card-name">Email</span>
            </a>
          </div>
        </motion.div>

        {/* === COLUMN 2: GLASS FORM WITH PHYSICS TILT === */}
        <motion.div variants={rightColumnVariants} className="flex justify-start lg:justify-end items-center relative">
          <span className="absolute -top-4 -right-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>
          <span className="absolute -bottom-4 -left-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>

          <motion.div
            ref={formRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX: shouldReduceMotion ? 0 : rotateX, rotateY: shouldReduceMotion ? 0 : rotateY }}
            className="w-full max-w-lg bg-surface/5 backdrop-blur-xl border border-white/10 p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-2xl will-change-transform rounded-sm"
          >
            {/* Dynamic Mouse Tracking Glow (GPU accelerated) */}
            <motion.div
              className="absolute pointer-events-none inset-0 z-0"
              style={{ background: glowPosition }}
            />

            <div className="relative z-10">
              <h3 className="font-google-sans-flex text-2xl md:text-3xl tracking-[0.2em] uppercase text-foreground/80 mb-10 border-b border-white/10 pb-4 inline-block">
                Send a Message
              </h3>

              <motion.form
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
                animate={shakeKey > 0 ? { x: shakeKey % 2 === 0 ? [-3, 3, -1, 1, 0] : [3, -3, 1, -1, 0] } : { x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AnimatedInput
                  label="Name"
                  value={formData.name}
                  onChange={(e) => handleChange(e, 'name')}
                  maxLength={60}
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
                  maxLength={80}
                  isInvalid={touched.subject && !isSubjectValid}
                  isValidField={touched.subject && isSubjectValid}
                />
                <AnimatedInput
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleChange(e, 'description')}
                  isTextArea={true}
                  maxLength={500}
                  isInvalid={touched.description && !isDescValid}
                  isValidField={touched.description && isDescValid}
                />

                <AnimatePresence>
                  {formStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-red-500 font-mono text-sm tracking-wide p-4 bg-red-500/10 border border-red-500/20 rounded-sm"
                    >
                      [ERROR]: {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="min-h-[60px] flex items-end justify-end mt-2">
                  <AnimatePresence mode="wait">
                    {formStatus === "success" ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-green-500 font-mono uppercase tracking-widest text-sm flex items-center gap-3 px-8 py-4 border border-green-500/30 bg-green-500/10 rounded-sm"
                      >
                        ✓ Delivered
                      </motion.div>
                    ) : formStatus === "whatsapp" ? (
                      <motion.div
                        key="whatsapp"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="text-yellow-400 font-mono uppercase tracking-widest text-xs flex items-center gap-3 px-6 py-4 border border-yellow-400/30 bg-yellow-400/10 rounded-sm"
                      >
                        ↗ Opening WhatsApp…
                      </motion.div>
                    ) : isValid ? (
                      <motion.button
                        key="button"
                        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        disabled={isSubmitting}
                        className="group relative flex items-center gap-4 bg-foreground text-background px-8 py-4 font-medium tracking-widest uppercase text-sm border border-transparent hover:bg-transparent hover:text-foreground hover:border-foreground transition-colors duration-300 disabled:opacity-75 disabled:cursor-wait rounded-sm"
                      >
                        {isSubmitting ? "Sending..." : "Submit"}
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
    </motion.section>
  )
}
