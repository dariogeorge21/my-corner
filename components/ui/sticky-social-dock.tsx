"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Mail, MessageCircle, MessagesSquare, Phone, Send, X } from "lucide-react"
import { SITE } from "@/lib/site"

const ACTIONS = [
  { id: "whatsapp", label: "WhatsApp", href: SITE.whatsappHref, external: true, Icon: MessageCircle },
  { id: "call", label: "Call", href: SITE.phoneHref, external: false, Icon: Phone },
  { id: "email", label: "Email", href: `mailto:${SITE.email}`, external: false, Icon: Mail },
  { id: "telegram", label: "Telegram", href: SITE.telegramHref, external: true, Icon: Send },
] as const

/**
 * Quick contact. One labeled "Contact" button; options open on tap/click.
 * Appears only after the hero, and hides when the contact form is on screen
 * (or on the /contact page) so it never covers the primary content.
 */
export default function StickySocialDock() {
  const pathname = usePathname()
  const [pastHero, setPastHero] = useState(false)
  const [contactVisible, setContactVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    const el = document.getElementById("contact")
    if (!el) {
      setContactVisible(false)
      return
    }
    const io = new IntersectionObserver(([entry]) => setContactVisible(entry.isIntersecting), {
      threshold: 0.15,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [pathname])

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("touchstart", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("touchstart", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const hidden = pathname === "/contact" || contactVisible || !pastHero

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.aside
          ref={rootRef}
          key="dock"
          aria-label="Quick contact"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-3"
        >
          <AnimatePresence>
            {open && (
              <motion.ul
                id="quick-contact-menu"
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.16 }}
                className="flex flex-col gap-2"
              >
                {ACTIONS.map(({ id, label, href, external, Icon }) => (
                  <li key={id}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="apple-glass-pill h-12 gap-3 px-5 text-sm font-medium text-foreground"
                    >
                      <Icon size={18} aria-hidden />
                      {label}
                    </a>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="quick-contact-menu"
            className="apple-glass-pill h-12 gap-2.5 px-5 text-sm font-semibold text-foreground md:h-14 md:px-6 md:text-base"
          >
            {open ? <X size={18} aria-hidden /> : <MessagesSquare size={18} aria-hidden />}
            {open ? "Close" : "Contact"}
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
