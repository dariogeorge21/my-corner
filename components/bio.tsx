"use client"

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { useRef, useMemo, useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Code2 } from "lucide-react"
import BorderGlow from "./BorderGlow"

// Animation variants for cinematic entrance
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
} as const

const titleVariants = {
  hidden: { opacity: 0, y: 80, rotateX: -45, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: "blur(0px)",
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
} as const

const subtitleVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 },
  },
} as const

const cardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
  },
} as const

const textStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
} as const

const textItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
} as const

export default function Bio() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const { theme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const shouldReduceMotion = useReducedMotion()

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
        palette: ["#E4D6A9", "#995F2F", "#622B14"],
        scrollIndicatorBg: "rgba(228, 214, 169, 0.2)",
        scrollIndicatorFill: "#E4D6A9",
      }
    } else {
      return {
        glowColor: "153 95 47", // Warm Brown RGB (light theme accent)
        backgroundColor: "rgba(250, 249, 246, 0.5)", // Alabaster Cream backdrop
        gridColor: "rgba(153, 95, 47, 0.03)", // Warm brown grid for light theme
        palette: ["#995F2F", "#E4D6A9", "#2A1D17"],
        scrollIndicatorBg: "rgba(153, 95, 47, 0.2)",
        scrollIndicatorFill: "#995F2F",
      }
    }
  }, [actualTheme])

  // Framer Motion Parallax Logic - track scroll progress within the section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Enhanced parallax: vertical movement + slight rotation for depth
  const yCard1 = useTransform(scrollYProgress, [0, 1], ["8%", "-12%"])
  const rotateCard1 = useTransform(scrollYProgress, [0, 1], [1, -1]) // subtle rotation (deg)
  
  // Scroll indicator progress (height of the line)
  const indicatorHeight = useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"])

  // Entrance animations - trigger when section is in view
  const isInView = {
    once: true,
    margin: "-100px 0px -100px 0px",
  }

  // For reduced motion, simplify all animations
  const safeTitleVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }
    : titleVariants

  const safeCardVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.5 } } }
    : cardVariants

  return (
    <motion.section
      id="about"
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={isInView}
      className="py-14 md:py-24 xl:py-32 px-6 md:px-12 max-w-[1800px] w-full mx-auto relative overflow-hidden"
      style={{ fontFamily: "var(--font-google-sans-flex)" }}
    >
      {/* Architectural Background Grid - Theme Aware with fade-in */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={isInView}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0 bg-[size:4rem_4rem] z-0 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none"
        style={{
          backgroundImage: mounted
            ? `linear-gradient(to right, ${themeColors.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${themeColors.gridColor} 1px, transparent 1px)`
            : undefined,
        }}
      />

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 relative z-10 w-full">
        {/* === LEFT COLUMN: Sticky Typographic Anchor with 3D Reveal === */}
        <div className="w-full lg:w-5/12 relative">
          <div className="lg:sticky lg:top-40 flex flex-col items-start h-fit">
            {/* Technical Label */}
            <motion.div variants={subtitleVariants} className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-accent" />
              <span className="font-mono text-xs tracking-[0.3em] text-accent uppercase font-medium">
                [ Core Identity ]
              </span>
            </motion.div>

            {/* Massive Awwwards-style stacked typography with 3D perspective */}
            <div
              className="perspective-container"
              style={{ perspective: shouldReduceMotion ? "none" : "1000px" }}
            >
              <motion.h2
                variants={safeTitleVariants}
                className="text-[12vw] lg:text-[6vw] font-black leading-[0.85] tracking-tighter uppercase text-foreground mb-6 will-change-transform"
              >
                THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-muted">
                  ARCHITECT
                </span>
              </motion.h2>
            </div>

            {/* Supplemental Text */}
            <motion.p
              variants={subtitleVariants}
              className="text-foreground/50 max-w-sm text-sm md:text-base leading-relaxed mb-8"
            >
              Operating at the intersection of technical precision and premium design. I engineer
              digital spaces that respect the user&apos;s time and attention.
            </motion.p>

            {/* Animated Scroll Indicator (now linked to scroll progress) */}
            <div className="w-[2px] h-32 bg-foreground/10 rounded-full overflow-hidden hidden lg:block relative">
              <motion.div
                style={{ height: indicatorHeight, backgroundColor: themeColors.scrollIndicatorFill }}
                className="absolute bottom-0 left-0 w-full rounded-full"
              />
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: Parallax Glow Card with Staggered Text === */}
        <div className="w-full lg:w-7/12 flex flex-col gap-12 lg:gap-24 pt-0 lg:pt-32">
          <motion.div
            ref={rightColumnRef}
            style={{ y: yCard1, rotate: rotateCard1 }}
            variants={safeCardVariants}
            className="relative z-20 w-full group"
          >
            {/* Architectural structural corner */}
            <span className="absolute -top-3 -left-3 text-foreground/40 font-mono text-xs z-30 opacity-0 group-hover:opacity-100 transition-opacity">
              +
            </span>

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
              <article className="p-5 sm:p-8 md:p-14 relative backdrop-blur-[12px] h-full rounded-[28px] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.3)] overflow-hidden">
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

                  <motion.div
                    variants={textStaggerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={isInView}
                    className="space-y-5 text-foreground/80 text-base md:text-xl leading-relaxed font-light text-left sm:text-right"
                  >
                    <motion.p variants={textItemVariants}>
                      I am an enthusiastic developer who thrives on building practical,
                      high-performance projects. With a deeply builder-oriented mindset, I love
                      transforming complex problems into elegant software solutions and consistently
                      pushing my boundaries with new paradigms.
                    </motion.p>
                    <motion.p variants={textItemVariants}>
                      Whether it&apos;s crafting highly scalable backends or choreographing
                      engaging, cinematic user interfaces, I approach every project as an
                      opportunity to build something extraordinary.
                    </motion.p>
                  </motion.div>
                </div>
              </article>
            </BorderGlow>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .perspective-container {
          perspective: 1000px;
        }
        @media (max-width: 1024px) {
          .perspective-container {
            perspective: none;
          }
        }
      `}</style>
    </motion.section>
  )
}