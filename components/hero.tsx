"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
// Assuming these are in your components directory as requested
import MagicRings from "./MagicRings"
import VariableProximity from "./VariableProximity"

const dynamicWords = ["DEVELOPER", "ARCHITECT", "DESIGNER", "BUILDER"]

const creativeWords = ["CREATIVE", "INNOVATIVE", "VISIONARY"]

const softwareWords = ["SOFTWARE","DESKTOP"]

const socialLinks = [
  { label: "LinkedIn", url: "https://www.linkedin.com/in/dariogeorge21/" },
  { label: "GitHub", url: "https://github.com/dariogeorge21" },
  { label: "LeetCode", url: "http://leetcode.com/dariogeorge21" },
  { label: "Instagram", url: "https://instagram.com/dariogeorge21" },
  { label: "Email", url: "mailto:edu.dariogeorge21@gmail.com" },
]

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)
  const [creativeWordIndex, setCreativeWordIndex] = useState(0)
  const [softwareWordIndex, setSoftwareWordIndex] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoverState, setHoverState] = useState<'portfolio' | 'projects' | string | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Cycle through dynamic words (bottom section) every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % dynamicWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  // Cycle through creative words (Line 1) every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCreativeWordIndex((prev) => (prev + 1) % creativeWords.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Cycle through software words (Line 2) every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSoftwareWordIndex((prev) => (prev + 1) % softwareWords.length)
    }, 12000)
    return () => clearInterval(interval)
  }, [])

  // Track global mouse position for the custom glass tooltip cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Track scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background select-none cursor-default"
      style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}
    >
      {/* 1. BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {/* The Magic Rings Component */}
        <div className="absolute inset-0 w-full h-full opacity-100">
          <MagicRings
            color="#995F2F" // Warm Brown from your palette
            colorTwo="#978F66" // Sage Taupe
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
        
        {/* Soft blur + Dark Shade overlay to pull Rings into the background */}
        <div className="absolute inset-0 bg-background/70 backdrop-blur-[12px] z-10" />

        {/* Architectural Grid (Subtle Brown/Black) replacing DotGrid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] z-20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </div>

      {/* 2. CENTER TYPOGRAPHY (Massive Spatial Impact) */}
      <div className="relative z-30 flex flex-col items-start w-full max-w-[90vw] md:max-w-[80vw] 2xl:max-w-[1400px]">
        {/* Line 1: CREATIVE (Dynamic) */}
        <div className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-foreground relative z-20 h-[1em] flex items-center" style={{ transform: `translateX(${-scrollY * 0.5}px)` }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={creativeWords[creativeWordIndex]}
              initial={{ opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" }}
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
        </div>
        
        {/* Line 2: SOFTWARE (Dynamic, Small indentation) */}
        <div className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-foreground/80 ml-[15vw] md:ml-[12vw] relative z-20 mix-blend-difference h-[1em] flex items-center" style={{ transform: `translateX(${scrollY * 0.5}px)` }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={softwareWords[softwareWordIndex]}
              initial={{ opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" }}
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
        </div>

        {/* Line 3: DYNAMIC WORD SET (Same indentation as CREATIVE, i.e., 0) */}
        <div className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-accent h-[1em] relative z-20 mt-2 md:mt-0 flex items-center" style={{ transform: `translateX(${-scrollY * 0.5}px)` }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={dynamicWords[wordIndex]}
              // Advanced Blur + 3D Rotate reveal pattern
              initial={{ opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
              style={{ transformOrigin: "center center -50px", transformStyle: "preserve-3d" }}
              className="absolute left-0 whitespace-nowrap"
            >
              {dynamicWords[wordIndex]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 3. LEFT WING (Architectural Menu) */}
      <div className="absolute left-6 md:left-12 bottom-12 md:bottom-1/4 z-40 flex flex-col gap-8 pointer-events-auto">
        <div 
          className="flex flex-col cursor-none"
          onMouseEnter={() => setHoverState('projects')}
          onMouseLeave={() => setHoverState(null)}
        >
          {["PLAN", "CODE", "DEPLOY"].map((text, i) => (
            <div key={text} className="relative group flex items-center py-2 px-6 border-b border-l border-foreground/10 bg-surface/10 backdrop-blur-sm transition-all duration-500 hover:bg-surface/30">
              {/* The "+" architectural corners */}
              <span className="absolute -left-1.5 -bottom-2 text-foreground/40 font-mono text-xs">+</span>
              <span className="absolute -right-1.5 -bottom-2 text-foreground/40 font-mono text-xs">+</span>
              <span className="absolute -left-1.5 -top-2 text-foreground/40 font-mono text-xs opacity-0 group-first:opacity-100">+</span>
              
              <span className="text-sm md:text-base tracking-widest uppercase font-medium text-foreground/80 group-hover:text-accent transition-colors">
                {text}
              </span>
            </div>
          ))}
        </div>
        
        {/* Since 2024 (Italic Signature) */}
        <div className="text-foreground/40 text-sm italic font-serif tracking-widest pl-2">
          Since 2024
        </div>
      </div>

      {/* 4. RIGHT WING (Terminal Action Link) */}
      <div className="absolute right-6 md:right-12 bottom-12 md:bottom-1/4 z-40 pointer-events-auto">
        <Link 
          href="https://portfolio.dariogeorge.in/" 
          target="_blank"
          onMouseEnter={() => setHoverState('portfolio')}
          onMouseLeave={() => setHoverState(null)}
          className="group relative flex items-center justify-center p-6 cursor-none"
        >
          {/* Natural smoke/glow hover effect behind the text */}
          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-full blur-xl transition-all duration-700 ease-out scale-50 group-hover:scale-150" />
          
          <span className="font-mono text-xs md:text-sm tracking-[0.3em] uppercase text-foreground relative z-10">
            [ View Portfolio ]
          </span>
          
          {/* Subtle line that draws through the text on hover */}
          <span className="absolute top-1/2 left-0 w-full h-[1px] bg-foreground/30 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 z-20 pointer-events-none" />
        </Link>
      </div>

      {/* 5. SOCIAL LINKS (Bottom Center Terminal Style - Full Width Spread) */}
      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-12 z-40 pointer-events-auto">
        <div className="flex w-full justify-between gap-2 md:gap-4 items-center">
          {socialLinks.map((link, index) => {
            const isHovered = hoverState === link.label
            const isOtherHovered = hoverState && hoverState !== link.label && socialLinks.some(l => l.label === hoverState)
            
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
                  x: isOtherHovered ? (index < socialLinks.findIndex(l => l.label === hoverState) ? -8 : 8) : 0,
                  opacity: hoverState && !isHovered ? 0.6 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative px-2 md:px-3 py-1.5 md:py-2 font-mono text-[10px] md:text-xs tracking-widest uppercase text-foreground/80 cursor-none flex-1 text-center"
              >
                {/* Architectural Corners + Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Top-left corner */}
                  <span className="absolute -left-2 -top-2 text-foreground/30 font-mono text-xs">+</span>
                  {/* Top-right corner */}
                  <span className="absolute -right-2 -top-2 text-foreground/30 font-mono text-xs">+</span>
                  {/* Bottom-left corner */}
                  <span className="absolute -left-2 -bottom-2 text-foreground/30 font-mono text-xs">+</span>
                  {/* Bottom-right corner */}
                  <span className="absolute -right-2 -bottom-2 text-foreground/30 font-mono text-xs">+</span>
                  
                  {/* Top and bottom lines */}
                  <motion.div
                    animate={{
                      opacity: isHovered ? 0.8 : 0.2,
                      backgroundColor: isHovered ? "#a0a0a0" : "transparent"
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-0 left-1 right-1 h-[1px] bg-foreground/20"
                  />
                  <motion.div
                    animate={{
                      opacity: isHovered ? 0.8 : 0.2,
                      backgroundColor: isHovered ? "#a0a0a0" : "transparent"
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-1 right-1 h-[1px] bg-foreground/20"
                  />
                  
                  {/* Left and right lines */}
                  <motion.div
                    animate={{
                      opacity: isHovered ? 0.8 : 0.2,
                      backgroundColor: isHovered ? "#a0a0a0" : "transparent"
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute left-0 top-1 bottom-1 w-[1px] bg-foreground/20"
                  />
                  <motion.div
                    animate={{
                      opacity: isHovered ? 0.8 : 0.2,
                      backgroundColor: isHovered ? "#a0a0a0" : "transparent"
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute right-0 top-1 bottom-1 w-[1px] bg-foreground/20"
                  />
                  
                  {/* Hover background */}
                  <motion.div
                    animate={{
                      opacity: isHovered ? 0.15 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-white/5 rounded-sm"
                  />
                </div>

                {/* Link Content */}
                <motion.div
                  animate={{
                    color: isHovered ? "#a0a0a0" : "inherit"
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <div className="font-mono font-medium">{link.label}</div>
                </motion.div>
              </motion.a>
            )
          })}
        </div>
      </div>

      {/* CUSTOM HARDWARE ACCELERATED GLASS CURSOR */}
      <AnimatePresence>
        {hoverState && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center"
            style={{ 
              x: mousePos.x + 20, 
              y: mousePos.y + 20,
            }}
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-foreground px-4 py-2 rounded-sm whitespace-nowrap overflow-hidden">
              <span className="font-mono text-xs tracking-widest uppercase font-medium">
                {hoverState === 'portfolio' ? 'VISIT PORTFOLIO' : hoverState === 'projects' ? 'SHOW PROJECTS' : `CONNECT VIA ${hoverState}`}
              </span>
              {/* Internal sweeping light effect */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}