"use client"

import { useRef } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

interface MagneticProps {
  children: React.ReactNode
  /** * How strong the magnetic pull is. 
   * 0.1 = subtle, 0.3 = strong pull, 0.5 = extreme 
   */
  strength?: number 
}

export default function Magnetic({ children, strength = 0.2 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  // 1. Use MotionValues instead of useState to prevent React re-renders on mousemove
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // 2. Wrap those values in a spring physics config for natural weight and momentum
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const { clientX, clientY } = e
    const { height, width, left, top } = ref.current.getBoundingClientRect()

    // Calculate distance from the center of the element
    const middleX = clientX - (left + width / 2)
    const middleY = clientY - (top + height / 2)

    // Apply the strength multiplier to the motion value
    x.set(middleX * strength)
    y.set(middleY * strength)
  }

  const handleMouseLeave = () => {
    // Snap back to origin (0,0) when mouse leaves
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }} // Bind spring physics to element transform
      className="w-fit h-fit flex items-center justify-center cursor-pointer"
    >
      {children}
    </motion.div>
  )
}