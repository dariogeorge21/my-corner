"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useMemo, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { MapPin, Cpu, Code2, GitMerge } from "lucide-react"
import BorderGlow from "./BorderGlow" // Adjust path based on your folder structure

export default function Bio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for hydration before using theme
  useEffect(() => {
    setMounted(true)
  }, [])

  // Determine actual theme (handle system theme)
  const actualTheme = mounted ? (theme === "system" ? systemTheme : theme) : "dark"

  // Theme-aware color palettes
  const themeColors = useMemo(() => {
    if (actualTheme === "dark") {
      return {
        glowColor: "228 214 169", // Warm Cream RGB (dark theme foreground)
        backgroundColor: "rgba(20, 16, 14, 0.4)", // Frosted Espresso backdrop
        gridColor: "rgba(228, 214, 169, 0.03)", // Light grid for dark theme
        palette: ["#E4D6A9", "#995F2F", "#622B14"], // Dark theme colors
        scrollIndicator: "rgba(255, 255, 255, 1)" // White for dark theme
      }
    } else {
      return {
        glowColor: "153 95 47", // Warm Brown RGB (light theme accent)
        backgroundColor: "rgba(250, 249, 246, 0.5)", // Alabaster Cream backdrop
        gridColor: "rgba(153, 95, 47, 0.03)", // Warm brown grid for light theme
        palette: ["#995F2F", "#E4D6A9", "#2A1D17"], // Light theme colors
        scrollIndicator: "rgba(42, 29, 23, 0.7)" // Dark indicator for light theme
      }
    }
  }, [actualTheme])

  // Framer Motion Parallax Logic
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Staggered parallax for the right-side cards to create a 3D depth effect
  const yCard1 = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"])
  const yCard2 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"])

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="py-32 px-6 md:px-12 max-w-[1800px] w-full mx-auto relative overflow-hidden" 
      style={{ fontFamily: "var(--font-google-sans-flex)" }}
    >
      {/* Architectural Background Grid - Theme Aware */}
      <div 
        suppressHydrationWarning
        className="absolute inset-0 bg-[size:4rem_4rem] z-0 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"
        style={{
          backgroundImage: mounted ? `linear-gradient(to right, ${themeColors.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${themeColors.gridColor} 1px, transparent 1px)` : undefined
        }}
      />

      <div className="flex flex-row lg:flex-row gap-16 lg:gap-8 relative z-10 w-full">
        
        {/* === LEFT COLUMN: Sticky Typographic Anchor === */}
        <div className="w-full lg:w-5/12 relative">
          <div className="lg:sticky lg:top-40 flex flex-col items-start h-fit">
            
            {/* Technical Label */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-accent" />
              <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-medium">
                [ Core Identity ]
              </span>
            </div>

            {/* Massive Awwwards-style stacked typography */}
            <h2 className="text-[12vw] lg:text-[6vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground mb-8">
              THE <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-muted">
                ARCHITECT
              </span>
            </h2>

            {/* Supplemental Text */}
            <p className="text-foreground/50 max-w-sm text-sm md:text-base leading-relaxed mb-8">
              Operating at the intersection of technical precision and premium design. I engineer digital spaces that respect the user's time and attention.
            </p>

            {/* Animated Scroll Indicator (Abstract) */}
            <div className="w-[1px] h-24 bg-gradient-to-b from-accent to-transparent relative overflow-hidden hidden lg:block">
              <motion.div 
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                suppressHydrationWarning
                style={{ backgroundColor: mounted ? themeColors.scrollIndicator : undefined }}
                className="absolute top-0 left-0 w-full h-8"
              />
            </div>

          </div>
        </div>

<br />
        {/* === RIGHT COLUMN: Parallax Glow Cards === */}
        <div className="w-full lg:w-7/12 flex flex-col gap-12 lg:gap-24 pt-0 lg:pt-32">
          
          {/* --- CARD 1: The Narrative --- */}
          <motion.div style={{ y: yCard1 }} suppressHydrationWarning className="relative z-20 w-full group">
            {/* Architectural structural corner */}
            <span className="absolute -top-3 -left-3 text-foreground/40 font-mono text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity">+</span>
            
            <BorderGlow  
              edgeSensitivity={40}  
              glowColor={mounted ? themeColors.glowColor : "228 214 169"}
              backgroundColor={mounted ? themeColors.backgroundColor : "rgba(20, 16, 14, 0.4)"}
              borderRadius={28}  
              glowRadius={50}  
              glowIntensity={0.8}  
              coneSpread={30}  
              animated={true}
              colors={mounted ? themeColors.palette : ["#E4D6A9", "#995F2F", "#622B14"]}
            >
              <div className="p-8 md:p-14 relative backdrop-blur-[12px] h-full rounded-[28px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
                
                {/* Background topographic/data texture */}
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,var(--accent)_1px,transparent_1px)] bg-[length:16px_16px]" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                      Builder-Oriented
                    </h3>
                    <div className="text-foreground/15">
                      <Code2 size={56} strokeWidth={1.2} />
                    </div>
                  </div>
                  
                  <div className="space-y-5 text-foreground/80 text-lg md:text-xl leading-relaxed font-light text-right">
                    <p>
                      I am an enthusiastic developer who thrives on building practical, high-performance projects. With a deeply builder-oriented mindset, I love transforming complex problems into elegant software solutions and consistently pushing my boundaries with new paradigms.
                    </p>
                    <p>
                      Whether it's crafting highly scalable backends or choreographing engaging, cinematic user interfaces, I approach every project as an opportunity to build something extraordinary.
                    </p>
                  </div>
                </div>
              </div>
            </BorderGlow>
          </motion.div>

          
        </div>
      </div>
    </section>
  )
}