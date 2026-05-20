"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

const projects = [
  { id: 1, title: "Nexus Interface", category: "App Design", color: "bg-neutral-800" },
  { id: 2, title: "Aura System", category: "Design System", color: "bg-stone-800" },
  { id: 3, title: "Lumina", category: "Web GL", color: "bg-zinc-900" },
]

export default function FeaturedWork() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  return (
    <section id="work" ref={containerRef} className="py-32 px-4 max-w-5xl mx-auto relative h-[300vh]">
      <div className="sticky top-32">
        <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase mb-4 block text-center">
          [ Selected Works ]
        </span>
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">Spatial Gallery</h2>
        
        <div className="relative w-full aspect-video md:aspect-[21/9]">
          {projects.map((project, i) => {
            // Create a staggered scaling effect as you scroll
            const targetScale = 1 - ( (projects.length - i) * 0.05 );
            const scale = useTransform(scrollYProgress, [i * 0.3, 1], [1, targetScale])
            const y = useTransform(scrollYProgress, [i * 0.3, 1], [0, -20 * i])
            
            return (
              <motion.div
                key={project.id}
                style={{ scale, y, top: i * 20 }}
                className={`absolute inset-0 rounded-3xl ${project.color} border border-white/10 shadow-glass overflow-hidden flex flex-col justify-end p-10 transform origin-top`}
              >
                <div className="relative z-10">
                  <span className="font-mono text-sm text-white/50 uppercase tracking-widest">{project.category}</span>
                  <h3 className="text-4xl font-bold text-white mt-2">{project.title}</h3>
                </div>
                {/* Simulated Glass Overlay */}
                <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-0" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}