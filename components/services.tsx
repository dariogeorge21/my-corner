"use client"

import { motion, useMotionValue, useSpring, useTransform, useVelocity, useReducedMotion, AnimatePresence } from "framer-motion"
import { useState, useRef, useEffect, useCallback } from "react"

// --- Service Data Structure ---
interface Service {
  id: string
  title: string
  description: string
  location: string
  techTags: string[]
  details: string
  gradient: string // for the portal background
}

const services: Service[] = [
  {
    id: "01",
    title: "Website Development",
    description: "Business sites, marketing platforms, Web apps",
    location: "PAN-INDIA",
    techTags: ["Next.js", "React", "Tailwind", "Framer Motion"],
    details: "From high-performance corporate websites to full‑stack web applications, I build scalable, accessible, and visually striking digital experiences.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "02",
    title: "Software Development",
    description: "Desktop apps, automation tools, internal dashboards",
    location: "REMOTE (Global)",
    techTags: ["Electron", "Tauri", "Python", "Rust"],
    details: "Custom software solutions tailored to your workflow – automate repetitive tasks, manage data, and increase team productivity.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "03",
    title: "Hardware Support",
    description: "PC building, upgrades, repair, networking",
    location: "DELHI NCR ONLY",
    techTags: ["Diagnostics", "Assembly", "Optimization"],
    details: "On‑site hardware services in Delhi – from custom PC builds to network troubleshooting and component upgrades.",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    id: "04",
    title: "Annual Maintenance Contract (AMC)",
    description: "IT infrastructure, servers, workstations",
    location: "DELHI / REMOTE",
    techTags: ["Monitoring", "Backups", "Security"],
    details: "Proactive maintenance, 24/7 monitoring, and rapid support to keep your business critical systems running smoothly.",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    id: "05",
    title: "AI & Automation",
    description: "LLM integration, RAG, agents, workflow automations",
    location: "GLOBAL",
    techTags: ["OpenAI", "LangChain", "Vector DBs"],
    details: "Leverage cutting‑edge AI to automate decision‑making, enhance customer experience, and unlock new capabilities.",
    gradient: "from-rose-500/20 to-red-500/20",
  },
]

// --- Individual Service Row Component (Desktop & Mobile) ---
interface ServiceRowProps {
  service: Service
  index: number
  isActive: boolean
  onHover: (id: string | null) => void
  onFocus: (id: string | null) => void
}

const ServiceRow = ({ service, index, isActive, onHover, onFocus }: ServiceRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const rowVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 } },
  }

  return (
    <motion.div
      ref={rowRef}
      variants={rowVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-50px" }}
      className={`group relative border-t border-foreground/10 last:border-b transition-colors duration-300 ${
        isActive ? "bg-accent/5" : ""
      }`}
      onMouseEnter={() => onHover(service.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onFocus(service.id)}
      onBlur={() => onFocus(null)}
      tabIndex={0}
      role="button"
      aria-label={`Service: ${service.title}`}
    >
      <div className="py-8 md:py-12 px-4 md:px-8 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer">
        {/* Index + Title Container */}
        <div className="flex-1 flex items-start gap-6">
          <span className="font-mono text-sm text-foreground/30 tracking-wider shrink-0">
            {service.id}
          </span>
          <div>
            <h3
              className={`text-3xl md:text-5xl font-bold tracking-tight transition-colors duration-300 ${
                isActive ? "text-foreground" : "text-foreground/40 group-hover:text-foreground/80"
              }`}
            >
              {service.title}
            </h3>
            {/* Desktop only description (inline) */}
            <div className="hidden md:block mt-2">
              <p className="font-mono text-xs uppercase tracking-wider text-foreground/50">
                {service.description}
              </p>
            </div>
          </div>
        </div>

        {/* Meta Tags (Location & Tech) */}
        <div className="flex flex-wrap gap-4 items-center md:w-2/5 justify-end">
          <span className="font-mono text-xs px-3 py-1 border border-foreground/20 rounded-full bg-surface/30 backdrop-blur-sm">
            {service.location}
          </span>
          <div className="flex gap-2">
            {service.techTags.slice(0, 2).map((tag) => (
              <span key={tag} className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                {tag}
              </span>
            ))}
            {service.techTags.length > 2 && (
              <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                +{service.techTags.length - 2}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile-only accordion panel (revealed when active on touch) */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="md:hidden overflow-hidden px-4 pb-6"
          >
            <p className="text-foreground/70 text-sm leading-relaxed mb-4">{service.details}</p>
            <div className="flex flex-wrap gap-2">
              {service.techTags.map((tag) => (
                <span key={tag} className="font-mono text-xs bg-surface/50 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop only hover details (appears as inline block on hover) */}
      <div className="hidden md:block">
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="px-4 md:px-8 pb-6 text-foreground/60 text-sm border-t border-foreground/10 pt-4"
            >
              {service.details}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// --- Floating 3D Glass Portal (Desktop only) ---
interface FloatingPortalProps {
  activeService: Service | null
  mouseX: any
  mouseY: any
}

const FloatingPortal = ({ activeService, mouseX, mouseY }: FloatingPortalProps) => {
  const shouldReduceMotion = useReducedMotion()
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Smooth spring values for the portal position
  const smoothX = useSpring(mouseX, { damping: 25, stiffness: 300, mass: 0.8 })
  const smoothY = useSpring(mouseY, { damping: 25, stiffness: 300, mass: 0.8 })

  // Velocity for tilt effect
  const velocityX = useVelocity(mouseX)
  const velocityY = useVelocity(mouseY)
  const tiltX = useTransform(velocityX, [-500, 500], [10, -10])
  const tiltY = useTransform(velocityY, [-500, 500], [-10, 10])

  // Also tilt based on cursor position relative to screen center
  const relativeX = useTransform(mouseX, [0, windowSize.width], [8, -8])
  const relativeY = useTransform(mouseY, [0, windowSize.height], [8, -8])

  const finalRotateY = useSpring(shouldReduceMotion ? 0 : tiltX, { stiffness: 300, damping: 20 })
  const finalRotateX = useSpring(shouldReduceMotion ? 0 : tiltY, { stiffness: 300, damping: 20 })
  const backgroundRotateY = useSpring(shouldReduceMotion ? 0 : relativeX, { stiffness: 200, damping: 25 })
  const backgroundRotateX = useSpring(shouldReduceMotion ? 0 : relativeY, { stiffness: 200, damping: 25 })

  if (!activeService) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-50 hidden md:block will-change-transform"
      style={{
        x: smoothX,
        y: smoothY,
        rotateX: finalRotateX,
        rotateY: finalRotateY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        style={{
          rotateX: backgroundRotateX,
          rotateY: backgroundRotateY,
        }}
        className={`w-64 h-64 rounded-2xl bg-gradient-to-br ${activeService.gradient} backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col items-center justify-center p-6 text-center`}
      >
        <h4 className="font-bold text-lg text-foreground mb-2">{activeService.title}</h4>
        <p className="text-xs text-foreground/70 font-mono">{activeService.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {activeService.techTags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

// --- Main Services Component ---
export default function Services() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // GPU-accelerated mouse tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const [isInside, setIsInside] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  const handleMouseEnterSection = useCallback(() => setIsInside(true), [])
  const handleMouseLeaveSection = useCallback(() => {
    setIsInside(false)
    setActiveId(null)
  }, [])

  const activeService = services.find((s) => s.id === activeId) || null

  // Variants for the sticky left column
  const leftVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  }

  const rightVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-32 px-6 md:px-12 max-w-[1800px] mx-auto w-full overflow-hidden"
      style={{ fontFamily: "var(--font-google-sans-flex)" }}
      onMouseEnter={handleMouseEnterSection}
      onMouseLeave={handleMouseLeaveSection}
    >
      {/* Subtle background grid (optional, matches your design system) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      <div className="flex flex-col lg:flex-row gap-16 relative z-10">
        {/* Sticky Left Column */}
        <motion.div
          variants={leftVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="lg:sticky lg:top-40 w-full lg:w-1/3 h-fit"
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-[1px] bg-accent" />
            <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-medium">
              [ CAPABILITIES ]
            </span>
          </div>
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.1] text-foreground">
            What I<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 to-muted">deliver</span>
          </h2>
          <p className="text-foreground/50 max-w-sm text-sm md:text-base leading-relaxed mt-6">
            A precise index of professional services – from full‑stack web development to on‑site hardware support.
          </p>
        </motion.div>

        {/* Right Column: Service Rows */}
        <motion.div
          variants={rightVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="w-full lg:w-2/3"
        >
          {services.map((service, idx) => (
            <ServiceRow
              key={service.id}
              service={service}
              index={idx}
              isActive={activeId === service.id}
              onHover={(id) => setActiveId(id)}
              onFocus={(id) => setActiveId(id)}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating 3D Glass Portal (only when mouse inside section and service active) */}
      <AnimatePresence>
        {isInside && activeService && !shouldReduceMotion && (
          <FloatingPortal activeService={activeService} mouseX={mouseX} mouseY={mouseY} />
        )}
      </AnimatePresence>
    </section>
  )
}