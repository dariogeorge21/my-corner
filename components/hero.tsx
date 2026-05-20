"use client"

import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import MagicRings from "./MagicRings"
import VariableProximity from "./VariableProximity"

const dynamicWords = ["DEVELOPER", "ARCHITECT", "DESIGNER", "BUILDER"]
const creativeWords = ["CREATIVE", "INNOVATIVE", "VISIONARY"]
const softwareWords = ["SOFTWARE", "DESKTOP"]

const socialLinks = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/dariogeorge21/" },
  { label: "GitHub", url: "https://github.com/dariogeorge21" },
  { label: "LeetCode", url: "http://leetcode.com/dariogeorge21" },
  { label: "Instagram", url: "https://instagram.com/dariogeorge21" },
  { label: "Email", url: "mailto:edu.dariogeorge21@gmail.com" },
]

// Staggered entrance variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Hero() {
  const { theme, setTheme } = useTheme()
  const [wordIndex, setWordIndex] = useState(0)
  const [creativeWordIndex, setCreativeWordIndex] = useState(0)
  const [softwareWordIndex, setSoftwareWordIndex] = useState(0)
  const [hoverState, setHoverState] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const shouldReduceMotion = useReducedMotion()

  // --- GPU-Accelerated Motion Values (replaces useState) ---
  const { scrollY } = useScroll()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for the custom cursor
  const smoothCursorX = useSpring(mouseX, { stiffness: 500, damping: 28 })
  const smoothCursorY = useSpring(mouseY, { stiffness: 500, damping: 28 })

  // Scroll-driven transforms for typography (cinematic exit)
  const creativeX = useTransform(scrollY, [0, 800], [0, -250])
  const softwareX = useTransform(scrollY, [0, 800], [0, 250])
  const dynamicX = useTransform(scrollY, [0, 800], [0, -150])
  const creativeOpacity = useTransform(scrollY, [0, 600], [1, 0.4])
  const softwareOpacity = useTransform(scrollY, [0, 600], [1, 0.4])
  const dynamicOpacity = useTransform(scrollY, [0, 600], [1, 0.4])
  const creativeScale = useTransform(scrollY, [0, 600], [1, 0.85])
  const softwareScale = useTransform(scrollY, [0, 600], [1, 0.85])
  const dynamicScale = useTransform(scrollY, [0, 600], [1, 0.85])

  // Mouse parallax for background grid (subtle Z-depth)
  const gridParallaxX = useTransform(mouseX, [-500, 500], [15, -15])
  const gridParallaxY = useTransform(mouseY, [-300, 300], [10, -10])

  // Cursor appearance/disappearance on window enter/leave
  const [isMouseInside, setIsMouseInside] = useState(false)

  // --- Word cycling intervals (unchanged, but performant) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % dynamicWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCreativeWordIndex((prev) => (prev + 1) % creativeWords.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setSoftwareWordIndex((prev) => (prev + 1) % softwareWords.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // --- Track mouse position for parallax and cursor, but with passive event for performance ---
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    const handleMouseEnter = () => setIsMouseInside(true)
    const handleMouseLeave = () => setIsMouseInside(false)

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    window.addEventListener("mouseenter", handleMouseEnter)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseenter", handleMouseEnter)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [mouseX, mouseY])

  return (
    <motion.section
      id="home"
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background select-none cursor-none"
      style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}
    >
      {/* 1. BACKGROUND LAYERS (with subtle mouse parallax) */}
      <motion.div
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        style={{ x: gridParallaxX, y: gridParallaxY }}
      >
        <div className="absolute inset-0 w-full h-full opacity-100">
          <MagicRings
            color="#995F2F"
            colorTwo="#978F66"
            ringCount={7}
            speed={1}
            attenuation={10}
            lineThickness={2}
            baseRadius={0.35}
            radiusStep={0.1}
            scaleRate={0.1}
            opacity={1}
            blur={0}
            noiseAmount={0.1}
            rotation={0}
            ringGap={1.5}
            fadeIn={0.7}
            fadeOut={0.5}
            followMouse={false}
            mouseInfluence={0.2}
            hoverScale={1.2}
            parallax={0.05}
            clickBurst={false}
          />
        </div>

        <div className="absolute inset-0 bg-background/70 backdrop-blur-[12px] z-10" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] z-20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </motion.div>

      {/* 2. CENTER TYPOGRAPHY (Massive Spatial Impact with scroll-driven transforms) */}
      <div className="relative z-30 flex flex-col items-start w-full max-w-[90vw] md:max-w-[80vw] 2xl:max-w-[1400px]">
        {/* Line 1: CREATIVE (Dynamic) */}
        <motion.div
          style={{
            x: creativeX,
            opacity: creativeOpacity,
            scale: creativeScale,
            filter: shouldReduceMotion ? "none" : undefined,
          }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1] }}
          className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-foreground relative z-20 h-[1em] flex items-center will-change-transform"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={creativeWords[creativeWordIndex]}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "center center -50px", transformStyle: "preserve-3d" }}
              className="absolute left-0 whitespace-nowrap"
            >
              <VariableProximity
                label={creativeWords[creativeWordIndex]}
                className="variable-proximity-demo"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={200}
                falloff="linear"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Line 2: SOFTWARE (Dynamic, indented) */}
        <motion.div
          style={{
            x: softwareX,
            opacity: softwareOpacity,
            scale: softwareScale,
            filter: shouldReduceMotion ? "none" : undefined,
          }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1] }}
          className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-foreground/80 ml-[15vw] md:ml-[12vw] relative z-20 mix-blend-difference h-[1em] flex items-center will-change-transform"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={softwareWords[softwareWordIndex]}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "center center -50px", transformStyle: "preserve-3d" }}
              className="absolute left-0 whitespace-nowrap"
            >
              <VariableProximity
                label={softwareWords[softwareWordIndex]}
                className="variable-proximity-demo"
                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
                containerRef={containerRef}
                radius={200}
                falloff="linear"
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Line 3: DYNAMIC WORD SET */}
        <motion.div
          style={{
            x: dynamicX,
            opacity: dynamicOpacity,
            scale: dynamicScale,
            filter: shouldReduceMotion ? "none" : undefined,
          }}
          transition={{ type: "tween", ease: [0.16, 1, 0.3, 1] }}
          className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-accent h-[1em] relative z-20 mt-2 md:mt-0 flex items-center will-change-transform"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={dynamicWords[wordIndex]}
              initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "center center -50px", transformStyle: "preserve-3d" }}
              className="absolute left-0 whitespace-nowrap"
            >
              {dynamicWords[wordIndex]}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 3. LEFT WING (Architectural Menu) - Staggered Entrance */}
      <motion.div
        variants={itemVariants}
        className="absolute left-6 md:left-12 bottom-12 md:bottom-1/4 z-40 flex flex-col gap-8 pointer-events-auto"
      >
        <div
          className="flex flex-col"
          onMouseEnter={() => setHoverState("projects")}
          onMouseLeave={() => setHoverState(null)}
        >
          {["PLAN", "CODE", "DEPLOY"].map((text, i) => (
            <div
              key={text}
              className="relative group flex items-center py-2 px-6 border-b border-l border-t border-r border-foreground/10 bg-surface/10 backdrop-blur-sm transition-all duration-500 hover:bg-surface/30"
            >
              <span className="absolute -left-1.5 -bottom-2 text-foreground/40 font-mono text-xs">+</span>
              <span className="absolute -right-1.5 -bottom-2 text-foreground/40 font-mono text-xs">+</span>
              <span className="absolute -left-1.5 -top-2 text-foreground/40 font-mono text-xs opacity-0 group-first:opacity-100">+</span>
              <span className="absolute -right-1.5 -top-2 text-foreground/40 font-mono text-xs opacity-0 group-first:opacity-100">+</span>
              <span className="text-sm md:text-base tracking-widest uppercase font-medium text-foreground/80 group-hover:text-accent transition-colors">
                {text}
              </span>
            </div>
          ))}
        </div>
        <div className="text-foreground/40 text-sm italic font-serif tracking-widest pl-2">Since 2024</div>
      </motion.div>

      {/* 4. RIGHT WING (Terminal Action Links) - Staggered Entrance */}
      <motion.div
        variants={itemVariants}
        className="absolute right-6 md:right-12 bottom-12 md:bottom-1/4 z-40 pointer-events-auto flex flex-col gap-8"
      >
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          onMouseEnter={() => setHoverState("theme")}
          onMouseLeave={() => setHoverState(null)}
          className="group relative flex items-center justify-center p-6 mb-[250px] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full blur-xl transition-all duration-700 ease-out scale-50 group-hover:scale-150" />
          <span className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-foreground relative z-10">
            [ Switch Theme ]
          </span>
          <span className="absolute top-1/2 left-0 w-full h-[1px] bg-foreground/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-20 pointer-events-none" />
        </button>

        <Link
          href="https://portfolio.dariogeorge.in/"
          target="_blank"
          onMouseEnter={() => setHoverState("portfolio")}
          onMouseLeave={() => setHoverState(null)}
          className="group relative flex items-center justify-center p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full blur-xl transition-all duration-700 ease-out scale-50 group-hover:scale-150" />
          <span className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-foreground relative z-10">
            [ View Portfolio ]
          </span>
          <span className="absolute top-1/2 left-0 w-full h-[1px] bg-foreground/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-20 pointer-events-none" />
        </Link>
      </motion.div>

      {/* 5. SOCIAL LINKS (Bottom Center Terminal Style) - Staggered Entrance */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-12 z-40 pointer-events-auto"
      >
        <div className="flex w-full justify-between gap-2 md:gap-4 items-center">
          {socialLinks.map((link, index) => {
            const isHovered = hoverState === link.label
            const isOtherHovered =
              hoverState && hoverState !== link.label && socialLinks.some((l) => l.label === hoverState)

            return (
              <motion.a
                key={link.label}
                href={link.url}
                target={link.label === "Email" ? "_self" : "_blank"}
                rel="noopener noreferrer"
                onMouseEnter={() => setHoverState(link.label)}
                onMouseLeave={() => setHoverState(null)}
                animate={{
                  scale: isHovered ? 1.05 : 1,
                  x: isOtherHovered ? (index < socialLinks.findIndex((l) => l.label === hoverState) ? -8 : 8) : 0,
                  opacity: hoverState && !isHovered ? 0.6 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative px-2 md:px-3 py-1.5 md:py-2 font-mono text-[10px] md:text-xs tracking-widest uppercase text-foreground/80 flex-1 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              >
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute -left-2 -top-2 text-foreground/30 font-mono text-xs">+</span>
                  <span className="absolute -right-2 -top-2 text-foreground/30 font-mono text-xs">+</span>
                  <span className="absolute -left-2 -bottom-2 text-foreground/30 font-mono text-xs">+</span>
                  <span className="absolute -right-2 -bottom-2 text-foreground/30 font-mono text-xs">+</span>
                  <motion.div
                    animate={{ opacity: isHovered ? 0.8 : 0.2, backgroundColor: isHovered ? "#a0a0a0" : "transparent" }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-1 right-1 h-[1px] bg-foreground/20"
                  />
                  <motion.div
                    animate={{ opacity: isHovered ? 0.8 : 0.2, backgroundColor: isHovered ? "#a0a0a0" : "transparent" }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-1 right-1 h-[1px] bg-foreground/20"
                  />
                  <motion.div
                    animate={{ opacity: isHovered ? 0.8 : 0.2, backgroundColor: isHovered ? "#a0a0a0" : "transparent" }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-1 bottom-1 w-[1px] bg-foreground/20"
                  />
                  <motion.div
                    animate={{ opacity: isHovered ? 0.8 : 0.2, backgroundColor: isHovered ? "#a0a0a0" : "transparent" }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 top-1 bottom-1 w-[1px] bg-foreground/20"
                  />
                  <motion.div
                    animate={{ opacity: isHovered ? 0.15 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-white/5 rounded-sm"
                  />
                </div>
                <motion.div
                  animate={{ color: isHovered ? "#a0a0a0" : "inherit" }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <div className="font-mono font-medium">{link.label}</div>
                </motion.div>
              </motion.a>
            )
          })}
        </div>
      </motion.div>

      {/* 6. CUSTOM HARDWARE ACCELERATED GLASS CURSOR (spring-driven, appears only when mouse is inside window) */}
      <AnimatePresence>
        {isMouseInside && hoverState && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center will-change-transform"
            style={{
              x: smoothCursorX,
              y: smoothCursorY,
              translateX: 20,
              translateY: 20,
            }}
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-foreground px-4 py-2 rounded-sm whitespace-nowrap overflow-hidden">
              <span className="font-mono text-xs tracking-widest uppercase font-medium">
                {hoverState === "portfolio"
                  ? "VISIT PORTFOLIO"
                  : hoverState === "projects"
                    ? "SHOW PROJECTS"
                    : hoverState === "theme"
                      ? "TOGGLE THEME"
                      : `CONNECT VIA ${hoverState}`}
              </span>
              <motion.div
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}