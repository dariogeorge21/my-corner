"use client"

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence, useReducedMotion } from "framer-motion"
import { useRef, useEffect, useCallback, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, MapPin, Mail } from "lucide-react"
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa"
import CircularText from "./CircularText"

// --- MAGNETIC LINK COMPONENT (Physics-based pull) ---
const MagneticLink = ({
  href,
  label,
  tooltipText,
  setHoverState,
  external = false,
  className = "",
}: {
  href: string
  label: React.ReactNode
  tooltipText: string
  setHoverState: (val: string | null) => void
  external?: boolean
  className?: string
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const smoothX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.3 })
  const smoothY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.3 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!linkRef.current) return
    const rect = linkRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distanceX = e.clientX - centerX
    const distanceY = e.clientY - centerY
    const maxDistance = 30
    const strength = 0.3
    const moveX = Math.min(Math.max(distanceX * strength, -maxDistance), maxDistance)
    const moveY = Math.min(Math.max(distanceY * strength, -maxDistance), maxDistance)
    x.set(moveX)
    y.set(moveY)
  }, [x, y])

  const handleMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
    setHoverState(null)
  }, [x, y, setHoverState])

  return (
    <Link
      ref={linkRef}
      href={href}
      target={external ? "_blank" : "_self"}
      onMouseEnter={() => setHoverState(tooltipText)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative flex items-center gap-2 w-fit cursor-none py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent rounded-sm ${className}`}
      style={{ transform: `translate3d(${smoothX.get()}px, ${smoothY.get()}px, 0)` }}
    >
      <span className="text-sm md:text-base font-medium tracking-wide text-foreground/80 group-hover:text-foreground transition-colors uppercase">
        {label}
      </span>
      <ArrowUpRight
        size={16}
        className="text-foreground/50 group-hover:text-accent transform transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:rotate-45"
      />
      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 origin-right transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:scale-x-100 group-hover:origin-left" />
    </Link>
  )
}

// --- Variants for staggered entrance on scroll ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const lineVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const navItemVariants = {
  hidden: { opacity: 0, y: 20, clipPath: "inset(0 0 100% 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const typographyVariants = {
  hidden: { rotateX: 60, y: 100, opacity: 0, filter: "blur(12px)" },
  visible: {
    rotateX: 0,
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] as const },
  },
}

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  // --- GPU-accelerated cursor tracking (replaces useState) ---
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothCursorX = useSpring(mouseX, { damping: 20, stiffness: 300, mass: 0.5 })
  const smoothCursorY = useSpring(mouseY, { damping: 20, stiffness: 300, mass: 0.5 })
  const [hoverState, setHoverState] = useState<string | null>(null)

  // --- Scroll-linked parallax & reveal ---
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  })

  // Footer sliding up on scroll (smoother with spring)
  const y = useTransform(scrollYProgress, [0, 1], ["15%", "0%"])
  const opacity = useTransform(scrollYProgress, [0, 0.4, 1], [0, 0.6, 1])

  // Massive typography letter-spacing tension (reveal: tightens)
  const letterSpacingLeft = useTransform(scrollYProgress, [0.5, 1], ["0.15em", "-0.02em"])
  const letterSpacingRight = useTransform(scrollYProgress, [0.5, 1], ["0.15em", "-0.02em"])

  // Mouse position update (passive, no React re-renders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [mouseX, mouseY])

  // Handle reduced motion: disable 3D rotate if needed
  const safeTypographyVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } }
    : typographyVariants

  return (
    <motion.footer
      ref={containerRef}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative w-full max-w-none overflow-x-clip overflow-y-hidden bg-background pt-32 pb-8 border-t border-foreground/10 box-border"
      style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}
    >
      {/* Architectural '+' marks with entrance spin */}
      <motion.div
        initial={{ opacity: 0, rotate: -90 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 left-8 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-sm"
      >
        +
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 90 }}
        whileInView={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="absolute top-0 right-8 translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-sm"
      >
        +
      </motion.div>

      <motion.div style={{ y, opacity }} className="w-full max-w-none mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24 box-border">
        {/* --- SECTION 1: Message & Vertical Nav --- */}
        <div className="flex w-full min-w-0 flex-col md:flex-row justify-evenly items-start gap-12 border-b border-foreground/10 pb-16 relative">
          <motion.div variants={lineVariants} className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground/20 origin-left" />
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-foreground/20 font-mono text-xs">+</div>

          <div className="max-w-2xl min-w-0 flex-1">
            <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-foreground/90 leading-snug">
              Connect with me to create incredible, bold and impactful work that aligns with your values and exceeds your
              standards.
            </h3>
          </div>

          <motion.nav variants={navItemVariants} className="flex w-full md:w-auto flex-col gap-4 md:items-start">
            <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono mb-2">[ NAVIGATION ]</span>
            <MagneticLink href="/" label="Home" tooltipText="Go to Homepage" setHoverState={setHoverState} />
            <MagneticLink href="#work" label="Work" tooltipText="View Selected Works" setHoverState={setHoverState} />
            <MagneticLink href="#about" label="About" tooltipText="Read My Philosophy" setHoverState={setHoverState} />
            <MagneticLink href="#contact" label="Contact" tooltipText="Start a Project" setHoverState={setHoverState} />
          </motion.nav>
        </div>

        {/* --- SECTION 2: Location & Socials --- */}
        <div className="flex w-full min-w-0 flex-col md:flex-row justify-between items-start md:items-center gap-12 border-b border-foreground/10 pb-16 relative">
          <motion.div variants={lineVariants} className="absolute bottom-0 right-0 w-full h-[1px] bg-foreground/20 origin-right" />
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-foreground/20 font-mono text-xs">+</div>

          <motion.div variants={navItemVariants} className="flex w-full min-w-0 flex-col gap-4 md:w-1/2">
            <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono mb-2">[ BASE OF OPERATIONS ]</span>
            <div className="flex w-full flex-wrap items-center gap-6 min-w-0">
              <div className="flex items-center gap-2 text-foreground/60">
                <MapPin size={18} />
                <span className="uppercase text-sm tracking-widest font-medium">Location:</span>
              </div>
              <MagneticLink
                href="https://www.google.com/maps/search/?api=1&query=New+Delhi"
                label="New Delhi"
                tooltipText="View on Maps"
                setHoverState={setHoverState}
                external
              />
              <span className="text-foreground/20">/</span>
              <MagneticLink
                href="https://www.google.com/maps/search/?api=1&query=Kerala"
                label="Kerala"
                tooltipText="View on Maps"
                setHoverState={setHoverState}
                external
              />
            </div>
          </motion.div>

          <motion.div variants={navItemVariants} className="flex w-full min-w-0 flex-col gap-4 md:w-1/2 md:items-end">
            <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono mb-2">[ DIGITAL PRESENCE ]</span>
            <div className="flex w-full flex-wrap items-center gap-8 md:justify-end">
              <span className="uppercase text-sm tracking-widest font-medium text-foreground/60 hidden md:block">Follow:</span>
              <MagneticLink
                href="https://linkedin.com/in/dariogeorge21"
                label={<FaLinkedin size={20} />}
                tooltipText="Visit LinkedIn"
                setHoverState={setHoverState}
                external
              />
              <MagneticLink
                href="https://twitter.com/dariogeorge21"
                label={<FaTwitter size={20} />}
                tooltipText="Visit Twitter"
                setHoverState={setHoverState}
                external
              />
              <MagneticLink
                href="https://instagram.com/dariogeorge21"
                label={<FaInstagram size={20} />}
                tooltipText="Visit Instagram"
                setHoverState={setHoverState}
                external
              />
            </div>
          </motion.div>
        </div>

        {/* --- SECTION 3: Massive Typography (DARIO * GEORGE) with 3D perspective --- */}
        <div
          className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-4 py-8 md:py-12 relative overflow-hidden"
          style={{ perspective: shouldReduceMotion ? "none" : "1200px" }}
        >
          <motion.div
            variants={safeTypographyVariants}
            style={{
              letterSpacing: letterSpacingLeft,
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}
            className="text-[11vw] sm:text-[10vw] md:text-[9vw] lg:text-[11vw] font-black tracking-tighter leading-none text-foreground uppercase flex-shrink-0"
          >
            DARIO
          </motion.div>

          <div className="flex-shrink-0 text-foreground/60 mx-2 md:mx-4">
            <CircularText
              text="DARIO*GEORGE*2026*"
              onHover="speedUp"
              spinDuration={shouldReduceMotion ? 0 : 20}
              className="text-foreground w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
            />
          </div>

          <motion.div
            variants={safeTypographyVariants}
            style={{
              letterSpacing: letterSpacingRight,
              transformOrigin: "bottom center",
              transformStyle: "preserve-3d",
            }}
            className="text-[11vw] sm:text-[9vw] md:text-[10vw] lg:text-[11vw] font-black tracking-tighter leading-none text-foreground uppercase flex-shrink-0"
          >
            GEORGE
          </motion.div>
        </div>

        {/* --- SECTION 4: Bottom Bar --- */}
        <div className="flex w-full min-w-0 flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-foreground/10 relative">
          <motion.div variants={lineVariants} className="absolute top-0 left-0 w-full h-[1px] bg-foreground/20 origin-left" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</div>

          <motion.div variants={navItemVariants} className="text-sm font-medium tracking-widest text-foreground/60 uppercase">
            Dario George © {new Date().getFullYear()}
          </motion.div>

          <motion.div variants={navItemVariants} className="flex items-center gap-6">
            <MagneticLink
              href="https://github.com/dariogeorge21"
              label={
                <div className="flex items-center gap-2">
                  <FaGithub size={16} />
                  <span>Github</span>
                </div>
              }
              tooltipText="View Repositories"
              setHoverState={setHoverState}
              external
            />
            <MagneticLink
              href="https://linkedin.com/in/dariogeorge21"
              label={
                <div className="flex items-center gap-2">
                  <FaLinkedin size={16} />
                  <span>LinkedIn</span>
                </div>
              }
              tooltipText="Connect on LinkedIn"
              setHoverState={setHoverState}
              external
            />
            <MagneticLink
              href="mailto:edu.dariogeorge21@gmail.com"
              label={
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>Email</span>
                </div>
              }
              tooltipText="Send an Email"
              setHoverState={setHoverState}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* --- CUSTOM HARDWARE-ACCELERATED GLASS CURSOR TOOLTIP --- */}
      <AnimatePresence>
        {hoverState && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center will-change-transform"
            style={{
              x: smoothCursorX,
              y: smoothCursorY,
              translateX: 15,
              translateY: 15,
            }}
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-foreground px-4 py-2 rounded-sm whitespace-nowrap overflow-hidden">
              <span className="font-mono text-xs tracking-widest uppercase font-medium">{hoverState}</span>
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.footer>
  )
}