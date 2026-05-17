"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import Magnetic from "./magnetic" // Adjust path as needed
import Shuffle from './Shuffle' // Your provided component

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isWobbling, setIsWobbling] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isEmailHovered, setIsEmailHovered] = useState(false)
  const [navShift, setNavShift] = useState({ x: 0, y: 0 })
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null)

  // Global mouse tracker for the whole-nav parallax and the email custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      // Calculate shift for the entire navbar (subtle glass parallax)
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const shiftX = (e.clientX - windowWidth / 2) * 0.02
      const shiftY = (e.clientY - windowHeight / 2) * 0.02
      setNavShift({ x: shiftX, y: shiftY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Handle Hamburger Wobble
  const triggerWobble = () => {
    if (isWobbling) return
    setIsWobbling(true)
    setTimeout(() => setIsWobbling(false), 1000)
  }

  const copyEmail = () => {
    navigator.clipboard.writeText("edu.dariogeorge21@gmail.com")
    // Optionally trigger a toast notification here
  }

  return (
    <>
      {/* --- MAIN FLOATING NAVBAR --- */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: navShift.y, opacity: 1, x: navShift.x }}
        transition={{ 
          y: { type: "spring", stiffness: 100, damping: 20 },
          opacity: { duration: 0.5 },
          x: { type: "tween", ease: "linear", duration: 0 },
        }}
        // Using a highly styled glass pill layout, shifting to the left logic as requested
        className="fixed top-6 left-0 right-0 z-[60] flex justify-between items-center px-8 w-full max-w-7xl mx-auto pointer-events-none"
      >
        {/* LEFT: Hamburger Menu */}
        <div className="pointer-events-auto">
          {/* <Magnetic> */}
            <motion.button
              onMouseEnter={triggerWobble}
              onClick={() => setIsSidebarOpen(true)}
              animate={isWobbling ? { 
                rotate: [0, -15, 15, -10, 10, -5, 5, 0] 
              } : {}}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="flex flex-col gap-[6px] p-4 group"
            >
              <span className="w-8 h-[2px] bg-foreground block origin-right transition-transform group-hover:scale-x-75" />
              <span className="w-8 h-[2px] bg-foreground block" />
            </motion.button>
          {/* </Magnetic> */}
        </div>

        {/* CENTER: Name with Shuffle Component */}
        <div className="pointer-events-auto font-sans font-medium tracking-tight text-xl hidden md:block">
          <Shuffle 
            text="Dario George"  
            shuffleDirection="right"  
            duration={0.35}  
            animationMode="evenodd"  
            shuffleTimes={1}  
            ease="power3.out"  
            stagger={0.03}  
            threshold={0.1}  
            triggerOnce={true}  
            triggerOnHover  
            respectReducedMotion={true}  
            loop={false}  
            loopDelay={0}
          />
        </div>

        {/* RIGHT: Connect Now Link */}
        <div className="pointer-events-auto">
          <Magnetic>
            <Link 
              href="#contact" 
              className="group relative px-4 py-2 font-sans font-medium text-sm tracking-wide text-foreground"
            >
              Connect Now
              {/* Exponential Hover Underline */}
              <span className="absolute bottom-1 left-0 w-full h-[1px] bg-foreground scale-x-0 origin-right transition-transform duration-500 ease-[cubic-bezier(0.87,0,0.13,1)] group-hover:scale-x-100 group-hover:origin-left" />
            </Link>
          </Magnetic>
        </div>
      </motion.header>


      {/* --- FULLSCREEN SIDEBAR OVERLAY --- */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 0% 0%)" }}
            animate={{ clipPath: "circle(150% at 0% 0%)" }}
            exit={{ clipPath: "circle(0% at 0% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] bg-background text-foreground flex flex-col justify-center px-8 md:px-24"
          >
            {/* Close Button */}
            <motion.button 
              onClick={() => setIsSidebarOpen(false)}
              whileHover={{ scale: 1.4, color: "#ff3333" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute top-10 right-10 text-sm font-medium uppercase tracking-widest transition-colors"
            >
              [ Close ]
            </motion.button>

            {/* Navigation Items */}
            <nav className="flex flex-col gap-8 w-full max-w-4xl mt-12">
              {['HOME', 'WORK', 'ABOUT', 'CONTACT'].map((item, index) => (
                <div 
                  key={item} 
                  className="relative border-b border-foreground/20 pb-4 group w-full text-center"
                  onMouseEnter={() => setHoveredNavItem(item)}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  {/* The '+' Corners */}
                  <span className="absolute -left-3 -bottom-[10px] text-foreground/40 font-mono">+</span>
                  <span className="absolute -right-3 -bottom-[10px] text-foreground/40 font-mono">+</span>
                  
                  {/* White Rectangle Background on Hover */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ 
                      scaleX: hoveredNavItem === item ? 1 : 0, 
                      opacity: hoveredNavItem === item ? 1 : 0 
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-0 -mx-4 md:-mx-8 bg-white/10 backdrop-blur-sm rounded-lg origin-center z-0"
                  />
                  
                  <motion.div
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
                    className="relative z-10"
                  >
                    <Link 
                      href={item === 'Home' ? '/' : `#${item.toLowerCase()}`}
                      onClick={() => setIsSidebarOpen(false)}
                      className="text-5xl md:text-8xl font-sans font-medium tracking-tighter hover:text-accent transition-colors duration-500"
                    >
                      {item}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </nav>

            {/* Bottom Email Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-10 left-8 md:left-24 font-sans text-center"
            >
              <div 
                className="text-lg md:text-2xl font-medium tracking-tight cursor-none text-center hover:text-accent transition-colors"
                onMouseEnter={() => setIsEmailHovered(true)}
                onMouseLeave={() => setIsEmailHovered(false)}
                onClick={copyEmail}
              >
                edu.dariogeorge21@gmail.com
              </div>
            </motion.div>

            {/* Custom Follower Cursor for Email Hover */}
            <AnimatePresence>
              {isEmailHovered && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="fixed pointer-events-none z-[80] bg-foreground text-background px-4 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap shadow-xl"
                  style={{ left: mousePos.x + 20, top: mousePos.y + 20 }} // Offset slightly from pointer
                >
                  Copy to Clipboard
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}