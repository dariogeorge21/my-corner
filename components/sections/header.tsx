"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { NAV_LINKS } from "@/lib/site"

export default function Header() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close on route change, Escape; lock body scroll while open
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : !href.includes("#") && pathname.startsWith(href)

  const isDark = resolvedTheme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-[60] transition-colors duration-300 ${
          scrolled || menuOpen
            ? "bg-background/80 backdrop-blur-md border-b border-foreground/10"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 md:h-20 max-w-[1800px] items-center justify-between px-5 md:px-12">
          {/* Brand */}
          <Link
            href="/"
            className="text-lg md:text-xl font-semibold tracking-tight text-foreground"
            aria-label="Dario George — home"
          >
            Dario George
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-10">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((item) => {
                const active = isActive(item.href)
                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className="group relative inline-block py-2 text-sm font-medium tracking-wide text-foreground/70 hover:text-foreground transition-colors duration-300 aria-[current=page]:text-foreground"
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0.5 left-0 h-px w-full bg-accent origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      />
                    </Link>
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              )}
              <Link
                href="/contact"
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85 active:scale-[0.98]"
              >
                Get a quote
              </Link>
            </div>
          </nav>

          {/* Mobile: labeled Menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {mounted && (
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/80"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            )}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-11 items-center gap-2.5 rounded-full border border-foreground/20 px-4 text-sm font-medium text-foreground"
            >
              <span>{menuOpen ? "Close" : "Menu"}</span>
              {menuOpen ? (
                <X size={16} aria-hidden />
              ) : (
                <span className="flex flex-col gap-[5px]" aria-hidden>
                  <span className="block h-[2px] w-4 bg-foreground" />
                  <span className="block h-[2px] w-4 bg-foreground" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[55] bg-background pt-20 px-5 pb-8 flex flex-col md:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {NAV_LINKS.map((item) => (
                  <li key={item.label} className="border-b border-foreground/10">
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex min-h-[60px] items-center justify-between text-2xl font-medium text-foreground aria-[current=page]:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-auto flex min-h-[56px] items-center justify-center rounded-full bg-foreground text-base font-semibold text-background"
            >
              Get a quote
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}