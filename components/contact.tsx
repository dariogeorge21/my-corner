"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect } from "react"
import { ArrowRight, Mail } from "lucide-react"
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from "react-icons/fa"
import { submitContact } from "@/app/actions/contact"

// --- TYPES & VALIDATION ---
type FormState = {
  name: string
  email: string
  subject: string
  description: string
}

const XSS_URL_REGEX = /(https?:\/\/[^\s]+|<[^>]*>)/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// --- CUSTOM ANIMATED INPUT COMPONENT ---
// Matches exact requested behavior: "NAME _" -> Hover dims -> Click "NAME: [____]"
const AnimatedInput = ({ 
  label, 
  value, 
  onChange, 
  isTextArea = false, 
  ...props 
}: { 
  label: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  isTextArea?: boolean,
  [key: string]: any 
}) => {
  const [focused, setFocused] = useState(false)
  const active = focused || value.length > 0
  const inputRef = useRef<any>(null)

  return (
    <div 
      className="group relative flex flex-col justify-end min-h-[3rem] border-b border-foreground/10 pb-2 cursor-text transition-colors hover:border-foreground/30"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-end gap-2 w-full">
        <span className={`font-mono text-xs uppercase tracking-widest text-foreground/60 transition-all duration-300 ${active ? 'text-accent' : ''}`}>
          {label}{active ? ':' : ''}
        </span>
        
        {/* The short placeholder underline that disappears when active */}
        {!active && (
          <div className="h-[1px] w-8 bg-foreground/40 transition-opacity duration-300 group-hover:opacity-30 group-hover:animate-pulse" />
        )}

        {/* The actual input field */}
        {isTextArea ? (
          <textarea
            ref={inputRef}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`bg-transparent outline-none flex-1 text-foreground transition-all duration-300 resize-none overflow-hidden h-6 leading-tight ${active ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
            {...props}
          />
        ) : (
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`bg-transparent outline-none flex-1 text-foreground transition-all duration-300 h-6 leading-tight ${active ? 'opacity-100 w-full' : 'opacity-0 w-0'}`}
            {...props}
          />
        )}
      </div>

      {/* Full width underline active state */}
      <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-accent transition-transform duration-500 origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
    </div>
  )
}

// --- MAIN CONTACT COMPONENT ---
export default function Contact() {
  // Form State
  const [formData, setFormData] = useState<FormState>({ name: "", email: "", subject: "", description: "" })
  const [isValid, setIsValid] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  
  // Mouse Glow State for Form
  const formRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // --- VALIDATION EFFECT ---
  useEffect(() => {
    const { name, email, subject, description } = formData
    
    const isNameValid = name.length >= 5 && name.length <= 30 && !XSS_URL_REGEX.test(name)
    const isEmailValid = EMAIL_REGEX.test(email) && !XSS_URL_REGEX.test(email)
    const isSubjectValid = subject.length >= 4 && subject.length <= 30 && !XSS_URL_REGEX.test(subject)
    const isDescValid = description.length >= 10 && description.length <= 100 && !XSS_URL_REGEX.test(description)

    setIsValid(isNameValid && isEmailValid && isSubjectValid && isDescValid)
  }, [formData])

  // --- FORM HANDLERS ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof FormState) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!formRef.current) return
    const rect = formRef.current.getBoundingClientRect()
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    
    setIsSubmitting(true)
    setFormStatus("idle")
    setErrorMessage("")

    try {
      const response = await submitContact({ 
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        description: formData.description,
        // turnstileToken: yourTurnstileState // Add this if you implement the Turnstile UI component
      })
      
      if (response.ok) {
        setFormStatus("success")
        setFormData({ name: "", email: "", subject: "", description: "" })
      } else {
        setFormStatus("error")
        setErrorMessage(response.error)
      }
    } catch (err) {
      setFormStatus("error")
      setErrorMessage("A critical network failure occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- INTERACTIVE TEXT SPLITTER ---
  const headline = "Let’s create something impact stories future together."
  const words = headline.split(" ")

  return (
    <section id="contact" className="py-32 px-6 md:px-12 max-w-[1400px] mx-auto w-full relative" style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}>
      
      {/* --- INJECTED 3D TILTED GLASS CARDS CSS --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .glass-card {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-start;
          gap: 20px;
          padding: 32px 36px;
          width: 240px;
          height: 100px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.320, 1);
          transform: perspective(1200px) rotateX(8deg) rotateY(-12deg) rotateZ(-8deg) translateY(0px);
          box-shadow: 
            20px 20px 60px rgba(0, 0, 0, 0.25),
            -5px -5px 15px rgba(255, 255, 255, 0.3),
            inset -2px -2px 5px rgba(255, 255, 255, 0.5),
            inset 2px 2px 5px rgba(0, 0, 0, 0.1);
        }
        .glass-card:nth-child(odd) {
          transform: perspective(1200px) rotateX(8deg) rotateY(-12deg) rotateZ(-8deg) translateY(-20px);
        }
        .glass-card:nth-child(even) {
          transform: perspective(1200px) rotateX(8deg) rotateY(12deg) rotateZ(8deg) translateY(20px);
        }
        .glass-card:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 
            25px 25px 80px rgba(0, 0, 0, 0.35),
            -5px -5px 20px rgba(255, 255, 255, 0.4),
            inset -2px -2px 8px rgba(255, 255, 255, 0.6),
            inset 2px 2px 8px rgba(0, 0, 0, 0.15);
          transform: perspective(1200px) rotateX(12deg) rotateY(-15deg) rotateZ(-10deg) translateY(-30px) translateZ(20px);
        }
        .glass-card:nth-child(even):hover {
          transform: perspective(1200px) rotateX(12deg) rotateY(15deg) rotateZ(10deg) translateY(30px) translateZ(20px);
        }
        .glass-card-icon {
          font-size: 48px;
          color: #333;
          transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1);
          flex-shrink: 0;
        }
        .glass-card:hover .glass-card-icon {
          color: var(--accent, #60a5fa);
          transform: scale(1.2) rotate(-5deg);
        }
        .glass-card-name {
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #333;
          transition: all 0.3s ease;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          white-space: nowrap;
        }
        .glass-card:hover .glass-card-name {
          color: var(--accent, #60a5fa);
        }
      `}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 mb-32">
        
        {/* === COLUMN 1: INTERACTIVE TYPOGRAPHY === */}
        <div className="flex flex-col justify-center">
          <h2 className="flex flex-wrap gap-x-4 gap-y-2 items-center">
            {words.map((word, wordIdx) => {
              // Custom styling for the word "stories"
              if (word.replace(/[^a-zA-Z]/g, '') === "stories") {
                return (
                  <span key={wordIdx} className="font-lobster italic text-4xl md:text-6xl text-accent font-normal mt-2 lowercase">
                    {word}
                  </span>
                )
              }
              // Ripple effect on hover for standard words
              return (
                <span key={wordIdx} className="flex overflow-hidden">
                  {word.split("").map((char, charIdx) => (
                    <motion.span
                      key={charIdx}
                      whileHover={{ y: -8, color: "var(--accent)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="text-4xl md:text-6xl font-bold text-foreground cursor-crosshair"
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              )
            })}
          </h2>
          <p className="mt-8 text-foreground/50 font-mono text-sm tracking-widest uppercase">
            [ Encrypted transmission channel ]
          </p>
        </div>

        {/* === COLUMN 2: GLASS FORM === */}
        <div className="flex justify-end relative">
          {/* Architectural corners behind the form */}
          <span className="absolute -top-4 -right-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>
          <span className="absolute -bottom-4 -left-4 text-foreground/20 font-mono text-xs hidden lg:block">+</span>

          <motion.div 
            ref={formRef}
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
            // Sharp edges, glass effect, no rounding
            className="w-full max-w-lg bg-surface/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 relative overflow-hidden shadow-2xl"
          >
            {/* Dynamic Mouse Tracking Glow */}
            <div 
              className="absolute pointer-events-none inset-0 z-0 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.06), transparent 80%)`,
              }}
            />

            <div className="relative z-10">
              <h3 className="font-mono text-sm tracking-[0.3em] uppercase text-foreground/80 mb-12 border-b border-white/10 pb-4 inline-block">
                CONTACT US
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                <AnimatedInput 
                  label="Name" 
                  value={formData.name} 
                  onChange={(e) => handleChange(e, 'name')}
                  maxLength={30}
                />
                
                <AnimatedInput 
                  label="Email" 
                  type="email"
                  value={formData.email} 
                  onChange={(e) => handleChange(e, 'email')}
                />
                
                <AnimatedInput 
                  label="Subject" 
                  value={formData.subject} 
                  onChange={(e) => handleChange(e, 'subject')}
                  maxLength={30}
                />
                
                <AnimatedInput 
                  label="Description" 
                  value={formData.description} 
                  onChange={(e) => handleChange(e, 'description')}
                  isTextArea={true}
                  maxLength={100}
                />

                {/* Animated Submit Button - Appears only when valid */}
                <div className="min-h-[60px] flex items-end justify-end mt-4">
                  <AnimatePresence>
                    {isValid && (
                      <motion.button
                        initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 10, filter: "blur(5px)" }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        disabled={isSubmitting}
                        className="group relative flex items-center gap-4 bg-foreground text-background px-8 py-4 font-medium tracking-widest uppercase text-sm border border-transparent hover:bg-transparent hover:text-foreground hover:border-foreground transition-colors duration-300"
                      >
                        {isSubmitting ? "Transmitting..." : "Initialize Sequence"}
                        <ArrowRight size={16} className="transform group-hover:translate-x-2 transition-transform duration-300" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* === ROW 2: 3D TILTED GLASS SOCIAL CARDS === */}
      <div className="w-full border-t border-foreground/10 pt-24 pb-12 mt-12 relative">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</span>
        
        <div className="flex flex-wrap justify-center items-center gap-6 max-w-6xl mx-auto px-4 md:px-0" style={{ perspective: "1000px" }}>
          
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="glass-card">
            <div className="glass-card-icon">
              <FaLinkedin />
            </div>
            <div className="glass-card-name">LinkedIn</div>
          </a>

          <a href="https://github.com" target="_blank" rel="noreferrer" className="glass-card">
            <div className="glass-card-icon">
              <FaGithub />
            </div>
            <div className="glass-card-name">GitHub</div>
          </a>

          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="glass-card">
            <div className="glass-card-icon">
              <FaTwitter />
            </div>
            <div className="glass-card-name">Twitter</div>
          </a>

          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="glass-card">
            <div className="glass-card-icon">
              <FaInstagram />
            </div>
            <div className="glass-card-name">Instagram</div>
          </a>

          <a href="mailto:edu.dariogeorge21@gmail.com" className="glass-card">
            <div className="glass-card-icon">
              <Mail size={48} />
            </div>
            <div className="glass-card-name">Email</div>
          </a>

        </div>
      </div>
    </section>
  )
}