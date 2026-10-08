"use client"

import { useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { PhoneCall, Mail } from "lucide-react"

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface SocialItem {
  id: string
  name: string
  actionText: string
  href: string
  isExternal: boolean
  icon: (props: { className?: string; size?: number }) => React.ReactNode
  ariaLabel: string
}

// ─── HIGH RESOLUTION VECTOR ICONS ────────────────────────────────────────────
// Telegram Vector Icon
const TelegramIcon = ({ className = "", size = 26 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,136,204,0.35)] ${className}`}
  >
    <path
      d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM16.64 8.8L15.06 16.24C14.94 16.77 14.63 16.9 14.18 16.65L11.78 14.88L10.62 16C10.49 16.13 10.38 16.24 10.13 16.24L10.3 13.8L14.74 9.79C14.93 9.62 14.7 9.53 14.44 9.7L8.95 13.15L6.59 12.41C6.08 12.25 6.07 11.9 6.7 11.65L15.91 8.1C16.34 7.94 16.71 8.2 16.64 8.8Z"
      fill="#0088cc"
    />
  </svg>
)

// WhatsApp Vector Icon
const WhatsAppIcon = ({ className = "", size = 26 }: { className?: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(37,211,102,0.35)] ${className}`}
  >
    <path
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.63C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.75 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.07 16.3C4.26 15.01 3.82 13.48 3.82 11.91C3.82 7.38 7.51 3.69 12.04 3.69C16.57 3.69 20.26 7.38 20.26 11.91C20.26 16.45 16.57 20.15 12.04 20.15ZM16.54 14.39C16.29 14.26 15.08 13.67 14.86 13.58C14.63 13.5 14.47 13.46 14.3 13.71C14.14 13.96 13.67 14.51 13.53 14.67C13.39 14.83 13.24 14.86 12.99 14.73C12.75 14.61 11.96 14.35 11.02 13.51C10.28 12.86 9.78 12.05 9.64 11.8C9.5 11.55 9.63 11.42 9.75 11.3C9.86 11.19 10 11.03 10.12 10.89C10.24 10.75 10.28 10.64 10.36 10.48C10.44 10.31 10.4 10.17 10.34 10.05C10.28 9.92 9.79 8.72 9.58 8.23C9.38 7.74 9.18 7.81 9.03 7.8C8.89 7.79 8.72 7.79 8.56 7.79C8.39 7.79 8.12 7.85 7.89 8.1C7.66 8.35 7.02 8.95 7.02 10.17C7.02 11.39 7.91 12.56 8.03 12.72C8.16 12.89 9.78 15.38 12.26 16.45C12.85 16.71 13.31 16.86 13.67 16.97C14.27 17.16 14.81 17.13 15.24 17.07C15.72 17 16.71 16.47 16.92 15.89C17.13 15.31 17.13 14.81 17.07 14.71C17.01 14.61 16.79 14.52 16.54 14.39Z"
      fill="#25D366"
    />
  </svg>
)

// ─── AWWWARDS / DRIBBBLE ROLLING TEXT REAPPEAR COMPONENT ──────────────────────
// "Text moves away towards up and then text reappears once again from the bottom"
function RollingText({
  text,
  hoverText,
  isHovered,
  className = "",
}: {
  text: string
  hoverText?: string
  isHovered: boolean
  className?: string
}) {
  const secondary = hoverText || text
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <span className={className}>{isHovered ? secondary : text}</span>
  }

  return (
    <span
      className={`relative inline-block overflow-hidden h-[1.3em] leading-[1.3em] align-middle ${className}`}
    >
      {/* Primary Line: Starts at 0%, rolls up to -100% on hover */}
      <motion.span
        initial={false}
        animate={{ y: isHovered ? "-100%" : "0%" }}
        transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
        className="inline-block whitespace-nowrap"
      >
        {text}
      </motion.span>

      {/* Secondary Line: Starts at 100% (bottom), reappears upward to 0% on hover */}
      <motion.span
        initial={false}
        animate={{ y: isHovered ? "0%" : "100%" }}
        transition={{ duration: 0.38, ease: [0.76, 0, 0.24, 1] }}
        className="absolute left-0 top-0 inline-block whitespace-nowrap text-accent dark:text-[#E4D6A9] font-semibold"
      >
        {secondary}
      </motion.span>
    </span>
  )
}

// ─── MAIN STICKY SOCIAL DOCK COMPONENT ───────────────────────────────────────
export default function StickySocialDock() {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const socialSpheres: SocialItem[] = [
    {
      id: "telegram",
      name: "Telegram",
      actionText: "Telegram ↗",
      href: "https://t.me/dariogeorge21",
      isExternal: true,
      icon: ({ size = 26 }) => <TelegramIcon size={size} />,
      ariaLabel: "Connect with Dario on Telegram",
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      actionText: "WhatsApp ↗",
      href: "https://wa.me/917560977040?text=Hi%20Dario,%20I'd%20like%20to%20discuss%20a%20project!",
      isExternal: true,
      icon: ({ size = 26 }) => <WhatsAppIcon size={size} />,
      ariaLabel: "Chat with Dario on WhatsApp",
    },
    {
      id: "email",
      name: "Email",
      actionText: "Email me ↗",
      href: "mailto:mail.dariogeorge@gmail.com",
      isExternal: false,
      icon: ({ size = 24 }) => (
        <Mail
          size={size}
          className="text-[#EA4335] dark:text-[#f87171] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(234,67,53,0.35)]"
        />
      ),
      ariaLabel: "Send email to mail.dariogeorge@gmail.com",
    },
  ]

  const directCallAction = {
    id: "call",
    name: "Call",
    actionText: "Call Now ↗",
    href: "tel:+917560977040",
    ariaLabel: "Call me directly",
  }

  return (
    <aside
      aria-label="Quick contact & social navigation"
      style={{ fontFamily: "var(--font-google-sans-flex), sans-serif" }}
      className="fixed bottom-6 right-5 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3 pointer-events-auto select-none"
    >
      {/* ─── 3D APPLE GLASS SPHERES (Telegram, WhatsApp, Email) ─── */}
      <div className="flex flex-col items-end gap-3">
        {socialSpheres.map((item) => {
          const isHovered = hoveredId === item.id

          return (
            <div
              key={item.id}
              className="relative flex items-center justify-end"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(item.id)}
              onBlur={() => setHoveredId(null)}
            >
              {/* Dynamic Floating Glass Tooltip to the left */}
              <AnimatePresence>
                {isHovered && !shouldReduceMotion && (
                  <motion.div
                    initial={{ opacity: 0, x: 12, scale: 0.94 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 450, damping: 28 }}
                    className="absolute right-full mr-3.5 px-3.5 py-1.5 rounded-full pointer-events-none whitespace-nowrap shadow-xl backdrop-blur-xl bg-white/90 dark:bg-stone-900/90 border border-white/90 dark:border-white/15 text-xs md:text-sm font-medium tracking-wide text-foreground"
                  >
                    <RollingText
                      text={item.name}
                      hoverText={item.actionText}
                      isHovered={isHovered}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* The 3D Glass Sphere Button */}
              <motion.a
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                aria-label={item.ariaLabel}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="apple-glass-sphere group w-12 h-12 md:w-14 md:h-14 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {item.icon({ size: 24 })}
              </motion.a>
            </div>
          )
        })}
      </div>

      {/* ─── APPLE GLASS CAPSULE PILL ("Book a call" / Direct Call) ─── */}
      <div
        className="relative flex items-center justify-end mt-0.5"
        onMouseEnter={() => setHoveredId(directCallAction.id)}
        onMouseLeave={() => setHoveredId(null)}
        onFocus={() => setHoveredId(directCallAction.id)}
        onBlur={() => setHoveredId(directCallAction.id)}
      >
        <motion.a
          href={directCallAction.href}
          aria-label={directCallAction.ariaLabel}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          className="apple-glass-pill group h-11 md:h-12 px-4 md:px-5 gap-2.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* Calendar Check Icon as shown in user sample image */}
          <div className="relative flex items-center justify-center text-foreground/75 group-hover:text-foreground transition-colors duration-300">
            <PhoneCall
              size={18}
              className="group-hover:hidden transition-transform duration-300"
            />
            <PhoneCall
              size={18}
              className="hidden group-hover:block text-accent dark:text-[#E4D6A9] animate-pulse"
            />
          </div>

          {/* Rolling Text Reappear inside the Pill */}
          <span className="text-xs md:text-sm font-medium tracking-wide text-foreground/90 group-hover:text-foreground">
            <RollingText
              text={directCallAction.name}
              hoverText={directCallAction.actionText}
              isHovered={hoveredId === directCallAction.id}
            />
          </span>
        </motion.a>
      </div>
    </aside>
  )
}
