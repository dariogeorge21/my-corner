"use client"

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import Magnetic from "../magnetic" // Adjust path as needed
import Shuffle from '../Shuffle' // Your provided component

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isWobbling, setIsWobbling] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isEmailHovered, setIsEmailHovered] = useState(false)
  const [navShift, setNavShift] = useState({ x: 0, y: 0 })
  const [hoveredNavItem, setHoveredNavItem] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  const scrollToHash = (hash: string) => {
    if (typeof window === "undefined") return
    if (!hash.startsWith("#")) return

    const id = hash.slice(1)
    if (!id) return

    const element = document.getElementById(id)
    if (!element) return

    element.scrollIntoView({ behavior: "smooth", block: "start" })
    window.history.pushState(null, "", hash)
  }

  const handleNavClick = (href: string, closeSidebar?: boolean) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith("#")) return

    e.preventDefault()
    if (closeSidebar) setIsSidebarOpen(false)
    window.setTimeout(() => scrollToHash(href), closeSidebar ? 50 : 0)
  }

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

  // Hydration safety for next-themes
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle Hamburger Wobble
  const triggerWobble = () => {
    if (isWobbling) return
    setIsWobbling(true)
    setTimeout(() => setIsWobbling(false), 1000)
  }

  const copyEmail = () => {
    // navigator.clipboard.writeText("contact@dariogeorge.in")
    //open the email client with a mailto link (optional)
    window.location.href = "mailto:edu.dariogeorge21@gmail.com";
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
        <div className="pointer-events-auto font-sans tracking-tight text-xl hidden md:block font-medium" style={{ fontFamily: "var(--font-agbalumo)" }}>
          <Shuffle
            text="Dario George"
            shuffleDirection="right"
            duration={5.95}
            animationMode="evenodd"
            shuffleTimes={1}
            ease="power3.out"
            stagger={0.03}
            threshold={0.4}
            triggerOnce={true}
            triggerOnHover
            respectReducedMotion={true}
            loop={false}
            loopDelay={4}
          />
        </div>

        {/* RIGHT: Theme Toggle + Connect Now Link */}
        <div className="pointer-events-auto flex items-center gap-4 md:gap-6">
          <Magnetic>
            <Link
              href="#contact"
              onClick={handleNavClick("#contact")}
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
              {[
                { label: "HOME", href: "/" },
                { label: "ABOUT", href: "/about" },
                { label: "SERVICES", href: "/services" },
                { label: "CONTACT", href: "/contact" },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className="relative border-b border-foreground/20 pb-4 group w-full text-center"
                  onMouseEnter={() => setHoveredNavItem(item.label)}
                  onMouseLeave={() => setHoveredNavItem(null)}
                >
                  {/* The '+' Corners */}
                  <span className="absolute -left-3 -bottom-[10px] text-foreground/40 font-mono">+</span>
                  <span className="absolute -right-3 -bottom-[10px] text-foreground/40 font-mono">+</span>

                  {/* White Rectangle Background on Hover */}
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{
                      scaleX: hoveredNavItem === item.label ? 1 : 0,
                      opacity: hoveredNavItem === item.label ? 1 : 0
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
                      href={item.href}
                      onClick={handleNavClick(item.href, true)}
                      className="text-5xl md:text-8xl font-sans font-medium tracking-tighter hover:text-accent transition-colors duration-500"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                </div>
              ))}

              {/* Theme Toggle on Right Side */}
              <div className="absolute right-8 md:right-24 top-1/2 -translate-y-1/2 pointer-events-auto">
                {mounted && (
                  <motion.button
                    onClick={() => {
                      setTheme(theme === "dark" ? "light" : "dark");
                      setIsSidebarOpen(false);
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="group relative p-4 rounded-lg backdrop-blur-md transition-all duration-300 flex items-center justify-center"
                    title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                  >
                    {/* Animated Background Glow on Hover */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Sun/Moon Icon with Morph Animation */}
                    <AnimatePresence mode="wait">
                      {theme === "dark" ? (
                        <motion.div
                          key="moon-sidebar"
                          initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: 180, opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                          className="relative z-10"
                        >
                          <Moon size={48} className="text-accent" strokeWidth={1.5} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="sun-sidebar"
                          initial={{ rotate: 180, opacity: 0, scale: 0.5 }}
                          animate={{ rotate: 0, opacity: 1, scale: 1 }}
                          exit={{ rotate: -180, opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                          className="relative z-10"
                        >
                          <Sun size={48} className="text-accent" strokeWidth={1.5} />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip */}
                    <motion.span
                      initial={{ opacity: 0, x: 8 }}
                      whileHover={{ opacity: 1, x: -32 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-full -ml-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-foreground text-background text-xs font-medium tracking-widest uppercase rounded-sm whitespace-nowrap pointer-events-none z-20"
                    >
                      {theme === "dark" ? "Light" : "Dark"}
                    </motion.span>
                  </motion.button>
                )}
              </div>
            </nav>

            {/* Bottom Email Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 font-sans text-center"
            >
              <div
                className="text-lg md:text-2xl font-medium tracking-tight cursor-none text-center hover:text-accent transition-colors"
                onMouseEnter={() => setIsEmailHovered(true)}
                onMouseLeave={() => setIsEmailHovered(false)}
                onClick={copyEmail}
              >
                contact@dariogeorge.in
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
                  Click to Mail
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}