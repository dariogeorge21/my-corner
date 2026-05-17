"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight, MapPin, Mail } from "lucide-react"
import { FaInstagram, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa"
import CircularText from "./CircularText" // Assuming you placed the provided component here

// --- CUSTOM REUSABLE LINK COMPONENT ---
// Handles the exponential underline, arrow rotation, and tooltip state
const FooterLink = ({ 
  href, 
  label, 
  tooltipText, 
  setHoverState, 
  external = false 
}: { 
  href: string, 
  label: string | React.ReactNode, 
  tooltipText: string, 
  setHoverState: (val: string | null) => void,
  external?: boolean
}) => {
  return (
    <Link 
      href={href}
      target={external ? "_blank" : "_self"}
      onMouseEnter={() => setHoverState(tooltipText)}
      onMouseLeave={() => setHoverState(null)}
      className="group relative flex items-center gap-2 w-fit cursor-none py-1"
    >
      <span className="text-sm md:text-base font-medium tracking-wide text-foreground/80 group-hover:text-foreground transition-colors uppercase">
        {label}
      </span>
      {/* Arrow that starts Top-Right (45deg) and rotates to Right (90deg) on hover */}
      <ArrowUpRight 
        size={16} 
        className="text-foreground/50 group-hover:text-accent transform transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:rotate-45" 
      />
      {/* Exponential Underline */}
      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 origin-right transition-transform duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:scale-x-100 group-hover:origin-left" />
    </Link>
  )
}

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [hoverState, setHoverState] = useState<string | null>(null)

  // Framer Motion Parallax Reveal Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  })
  
  // Footer starts slightly pushed down and slides up into place as you scroll
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "0%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1])

  // Track mouse for the custom glass tooltip
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <footer 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background pt-32 pb-8 border-t border-foreground/10"
      style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}
    >
      {/* Architectural '+' marks on the top border corners */}
      <div className="absolute top-0 left-8 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-sm">+</div>
      <div className="absolute top-0 right-8 translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-sm">+</div>

      <motion.div style={{ y, opacity }} className="max-w-full mx-auto px-6 md:px-12 flex flex-col gap-16 md:gap-24">
        
        {/* --- SECTION 1: Message & Vertical Nav --- */}
        <div className="flex flex-col md:flex-row justify-evenly items-start gap-12 border-b border-foreground/10 pb-16 relative">
          {/* Architectural '+' on bottom border */}
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-foreground/20 font-mono text-xs">+</div>
          
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-4xl font-medium tracking-tight text-foreground/90 leading-snug">
              Connect with me to create incredible, bold and impactful work that aligns with your values and exceeds your standards.
            </h3>
          </div>
          
          <nav className="flex flex-col gap-4">
            <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono mb-2">[ NAVIGATION ]</span>
            <FooterLink href="/" label="Home" tooltipText="Go to Homepage" setHoverState={setHoverState} />
            <FooterLink href="#work" label="Work" tooltipText="View Selected Works" setHoverState={setHoverState} />
            <FooterLink href="#about" label="About" tooltipText="Read My Philosophy" setHoverState={setHoverState} />
            <FooterLink href="#contact" label="Contact" tooltipText="Start a Project" setHoverState={setHoverState} />
          </nav>
        </div>

        {/* --- SECTION 2: Location & Socials --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 border-b border-foreground/10 pb-16 relative">
          <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-foreground/20 font-mono text-xs">+</div>

          {/* Left: Location Stack */}
          <div className="flex flex-col gap-4 w-full md:w-1/2">
            <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono mb-2">[ BASE OF OPERATIONS ]</span>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-foreground/60">
                <MapPin size={18} />
                <span className="uppercase text-sm tracking-widest font-medium">Location:</span>
              </div>
              <FooterLink 
                href="https://www.google.com/maps/search/?api=1&query=New+Delhi" 
                label="New Delhi" 
                tooltipText="View on Maps" 
                setHoverState={setHoverState} 
                external 
              />
              <span className="text-foreground/20">/</span>
              <FooterLink 
                href="https://www.google.com/maps/search/?api=1&query=Kerala" 
                label="Kerala" 
                tooltipText="View on Maps" 
                setHoverState={setHoverState} 
                external 
              />
            </div>
          </div>

          {/* Right: Social Stack */}
          <div className="flex flex-col gap-4 w-full md:w-1/2 md:items-end">
            <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono mb-2">[ DIGITAL PRESENCE ]</span>
            <div className="flex items-center gap-8">
              <span className="uppercase text-sm tracking-widest font-medium text-foreground/60 hidden md:block">Follow:</span>
              <FooterLink 
                href="https://linkedin.com/in/dariogeorge21" 
                label={<FaLinkedin size={20} />} 
                tooltipText="Visit LinkedIn" 
                setHoverState={setHoverState} 
                external 
              />
              <FooterLink 
                href="https://twitter.com/dariogeorge21" 
                label={<FaTwitter size={20} />} 
                tooltipText="Visit Twitter" 
                setHoverState={setHoverState} 
                external 
              />
              <FooterLink 
                href="https://instagram.com/dariogeorge21" 
                label={<FaInstagram size={20} />} 
                tooltipText="Visit Instagram" 
                setHoverState={setHoverState} 
                external 
              />
            </div>
          </div>
        </div>

        {/* --- SECTION 3: Massive Typography (DARIO * GEORGE) --- */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-6 md:gap-4 py-8 md:py-12 relative overflow-hidden">
          {/* Smooth Inward Tilt Animation on Scroll */}
          <motion.div 
            initial={{ rotateX: 60, y: 100, opacity: 0, filter: "blur(10px)" }}
            whileInView={{ rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
            style={{ transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
            className="text-[12vw] sm:text-[10vw] md:text-[11vw] lg:text-[12vw] font-black tracking-tighter leading-none text-foreground uppercase flex-shrink-0"
          >
            DARIO
          </motion.div>

          <div className="flex-shrink-0 text-foreground/60 mx-2 md:mx-4">
            <CircularText
              text="DARIO*GEORGE*2026*"
              onHover="speedUp"
              spinDuration={20}
              className="text-foreground w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
            />
          </div>

          <motion.div 
            initial={{ rotateX: 60, y: 100, opacity: 0, filter: "blur(10px)" }}
            whileInView={{ rotateX: 0, y: 0, opacity: 1, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
            style={{ transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
            className="text-[12vw] sm:text-[10vw] md:text-[11vw] lg:text-[12vw] font-black tracking-tighter leading-none text-foreground uppercase flex-shrink-0"
          >
            GEORGE
          </motion.div>
        </div>

        {/* --- SECTION 4: Bottom Bar --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-8 border-t border-foreground/10 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-foreground/20 font-mono text-xs">+</div>
           
           <div className="text-sm font-medium tracking-widest text-foreground/60 uppercase">
             Dario George © {new Date().getFullYear()}
           </div>

           <div className="flex items-center gap-6">
             <FooterLink 
               href="https://github.com/dariogeorge21" 
               label={<div className="flex items-center gap-2"><FaGithub size={16}/><span>Github</span></div>} 
               tooltipText="View Repositories" 
               setHoverState={setHoverState} 
               external 
             />
             <FooterLink 
               href="https://linkedin.com/in/dariogeorge21" 
               label={<div className="flex items-center gap-2"><FaLinkedin size={16}/><span>LinkedIn</span></div>} 
               tooltipText="Connect on LinkedIn" 
               setHoverState={setHoverState} 
               external 
             />
             <FooterLink 
               href="mailto:edu.dariogeorge21@gmail.com" 
               label={<div className="flex items-center gap-2"><Mail size={16}/><span>Email</span></div>} 
               tooltipText="Send an Email" 
               setHoverState={setHoverState} 
             />
           </div>
        </div>

      </motion.div>

      {/* --- CUSTOM GLASS CURSOR TOOLTIP --- */}
      <AnimatePresence>
        {hoverState && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 0.5, opacity: 0, filter: "blur(5px)" }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center"
            style={{ 
              x: mousePos.x + 15, 
              y: mousePos.y + 15,
            }}
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] text-foreground px-4 py-2 rounded-sm whitespace-nowrap overflow-hidden">
              <span className="font-mono text-xs tracking-widest uppercase font-medium">
                {hoverState}
              </span>
              {/* Internal sweeping light effect for extra premium feel */}
              <motion.div 
                animate={{ x: ["-100%", "200%"] }} 
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  )
}