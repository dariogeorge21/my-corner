"use client"

import { motion } from "framer-motion"
import { useState } from "react"

const technologies = [
  { name: "Next.js", color: "hover:text-white hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" },
  { name: "React", color: "hover:text-[#61DAFB] hover:drop-shadow-[0_0_15px_rgba(97,218,251,0.5)]" },
  { name: "TypeScript", color: "hover:text-[#3178C6] hover:drop-shadow-[0_0_15px_rgba(49,120,198,0.5)]" },
  { name: "Tailwind CSS", color: "hover:text-[#38BDF8] hover:drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" },
  { name: "Framer Motion", color: "hover:text-[#FF0055] hover:drop-shadow-[0_0_15px_rgba(255,0,85,0.5)]" },
  { name: "WebGL", color: "hover:text-[#990000] hover:drop-shadow-[0_0_15px_rgba(153,0,0,0.5)]" },
  { name: "Node.js", color: "hover:text-[#339933] hover:drop-shadow-[0_0_15px_rgba(51,153,51,0.5)]" },
  { name: "GraphQL", color: "hover:text-[#E10098] hover:drop-shadow-[0_0_15px_rgba(225,0,152,0.5)]" },
]

export default function TechStack() {
  const [isHovered, setIsHovered] = useState(false)

  // Duplicate the array to ensure seamless infinite looping
  const duplicatedTech = [...technologies, ...technologies, ...technologies]

  return (
    <section className="py-24 overflow-hidden relative w-full border-y border-border/50 bg-surface/30">
      {/* Edge Gradients for smooth fade in/out */}
      <div className="absolute top-0 left-0 w-32 md:w-64 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div 
        className="flex"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="flex whitespace-nowrap gap-16 md:gap-24 px-8 items-center"
          animate={{ x: isHovered ? "0%" : "-33.33%" }} // Moves exactly one full list length
          initial={{ x: "0%" }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
            // Smoothly pause/resume animation
            repeatType: "loop",
          }}
          // The 'style' prop ensures the animation pauses seamlessly
          style={{ x: isHovered ? undefined : "-33.33%" }} 
        >
          {duplicatedTech.map((tech, index) => (
            <div 
              key={index}
              className={`text-3xl md:text-5xl font-bold tracking-tighter text-foreground/20 cursor-pointer transition-all duration-500 ease-out flex items-center gap-4 ${tech.color}`}
            >
              {/* Optional glowing dot next to the text */}
              <div className="w-2 h-2 rounded-full bg-current opacity-0 group-hover:opacity-100 transition-opacity" />
              {tech.name}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}