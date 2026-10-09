"use client"

import { motion, AnimatePresence, useScroll, useTransform, useMotionValue } from "framer-motion"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import MagicRings from "../MagicRings"
import VariableProximity from "../VariableProximity"
import { useRichEffects } from "@/lib/use-rich-effects"
import { SITE } from "@/lib/site"

const dynamicWords = ["DEVELOPER", "ARCHITECT", "DESIGNER", "BUILDER"]
const creativeWords = ["CREATIVE", "INNOVATIVE", "VISIONARY"]
const softwareWords = ["SOFTWARE", "DESKTOP"]

const wordMotion = {
  initial: { opacity: 0, y: 40, rotateX: -60, filter: "blur(20px)" },
  animate: { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -40, rotateX: 60, filter: "blur(20px)" },
  transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] as [number, number, number, number] },
}

/**
 * Hero
 * Desktop (fine pointer, ≥1024px, motion allowed): full signature effects —
 * WebGL rings, cycling 3D type, proximity typography, scroll/mouse parallax.
 * Mobile / reduced motion: static headline, no WebGL, no parallax.
 * Both: a plain-language value proposition and ONE primary action ("Get a quote").
 */
export default function Hero() {
  const rich = useRichEffects()
  const [wordIndex, setWordIndex] = useState(0)
  const [creativeWordIndex, setCreativeWordIndex] = useState(0)
  const [softwareWordIndex, setSoftwareWordIndex] = useState(0)
  const containerRef = useRef<HTMLElement>(null)

  const { scrollY } = useScroll()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const creativeX = useTransform(scrollY, [0, 800], [0, -250])
  const softwareX = useTransform(scrollY, [0, 800], [0, 250])
  const dynamicX = useTransform(scrollY, [0, 800], [0, -150])
  const fade = useTransform(scrollY, [0, 600], [1, 0.4])
  const shrink = useTransform(scrollY, [0, 600], [1, 0.85])
  const gridParallaxX = useTransform(mouseX, [-500, 500], [15, -15])
  const gridParallaxY = useTransform(mouseY, [-300, 300], [10, -10])

  // Word cycling — desktop only
  useEffect(() => {
    if (!rich) return
    const a = setInterval(() => setWordIndex((p) => (p + 1) % dynamicWords.length), 2000)
    const b = setInterval(() => setCreativeWordIndex((p) => (p + 1) % creativeWords.length), 4000)
    const c = setInterval(() => setSoftwareWordIndex((p) => (p + 1) % softwareWords.length), 12000)
    return () => {
      clearInterval(a)
      clearInterval(b)
      clearInterval(c)
    }
  }, [rich])

  // Mouse parallax — desktop only
  useEffect(() => {
    if (!rich) return
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener("mousemove", onMove, { passive: true })
    return () => window.removeEventListener("mousemove", onMove)
  }, [rich, mouseX, mouseY])

  const lineStyle = (x: typeof creativeX) => (rich ? { x, opacity: fade, scale: shrink } : undefined)

  const renderWord = (words: string[], index: number, proximity: boolean) =>
    rich ? (
      <AnimatePresence mode="wait">
        <motion.div
          key={words[index]}
          {...wordMotion}
          style={{ transformOrigin: "center center -50px", transformStyle: "preserve-3d" }}
          className="absolute left-0 whitespace-nowrap"
        >
          {proximity ? (
            <VariableProximity
              label={words[index]}
              className="variable-proximity-demo"
              fromFontVariationSettings="'wght' 400, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
              containerRef={containerRef as React.RefObject<HTMLElement>}
              radius={200}
              falloff="linear"
            />
          ) : (
            words[index]
          )}
        </motion.div>
      </AnimatePresence>
    ) : (
      <span className="absolute left-0 whitespace-nowrap">{words[0]}</span>
    )

  return (
    <section
      id="home"
      ref={containerRef}
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden bg-background px-5 pt-28 pb-16 md:px-12"
    >
      {/* Background — WebGL rings & grid only on desktop */}
      <motion.div
        className="absolute inset-0 z-10 overflow-hidden pointer-events-none"
        style={rich ? { x: gridParallaxX, y: gridParallaxY } : undefined}
        aria-hidden
      >
        {rich && (
          <div className="absolute inset-0 w-full h-full">
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
        )}
        <div className={`absolute inset-0 bg-background/70 z-10 ${rich ? "backdrop-blur-[12px]" : ""}`} />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(153,95,47,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(153,95,47,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] z-20 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
      </motion.div>

      {/* Headline */}
      <h1
        id="hero-heading"
        className="relative z-30 flex flex-col items-start w-full max-w-[90vw] md:max-w-[80vw] 2xl:max-w-[1400px] overflow-hidden select-none"
      >
        <span className="sr-only">
          Dario George – website developer, documentation and PC hardware support in Delhi and Kerala, India.
        </span>

        <motion.div
          aria-hidden
          style={lineStyle(creativeX)}
          className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-foreground relative z-20 h-[1em] flex items-center will-change-transform"
        >
          {renderWord(creativeWords, creativeWordIndex, true)}
        </motion.div>

        <motion.div
          aria-hidden
          style={lineStyle(softwareX)}
          className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-foreground/80 ml-[15vw] md:ml-[12vw] relative z-20 h-[1em] flex items-center will-change-transform"
        >
          {renderWord(softwareWords, softwareWordIndex, true)}
        </motion.div>

        <motion.div
          aria-hidden
          style={lineStyle(dynamicX)}
          className="text-[14vw] md:text-[11vw] font-black leading-[0.8] tracking-tighter uppercase text-accent h-[1em] relative z-20 mt-2 md:mt-0 flex items-center will-change-transform"
        >
          {renderWord(dynamicWords, wordIndex, false)}
        </motion.div>
      </h1>

      {/* Value proposition + the one primary action */}
      <div className="relative z-40 mt-10 md:mt-14 w-full max-w-[90vw] md:max-w-[80vw] 2xl:max-w-[1400px] flex flex-col gap-6">
        <p className="max-w-2xl text-lg md:text-2xl leading-snug text-foreground/85">
          I build <strong className="font-semibold text-foreground">websites and web apps</strong> for businesses
          across India — plus documentation, event posters and on-site PC support in Delhi NCR.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Link
            href="/contact"
            className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-foreground px-8 text-base font-semibold text-background transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Get a quote
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
          <Link
            href="/#work"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-foreground/30 px-8 text-base font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            See my work
          </Link>
        </div>

        <p className="text-sm text-foreground/65 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>Based in Delhi &amp; Kerala · Replies within 24 hours ·</span>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-foreground"
          >
            <MessageCircle size={14} aria-hidden /> Chat on WhatsApp
          </a>
        </p>
      </div>
    </section>
  )
}