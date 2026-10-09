"use client"

import { useEffect, useState } from "react"

/**
 * True only on desktop-class devices: wide viewport, fine pointer (mouse),
 * hover support and no reduced-motion preference. Heavy decorative effects
 * (WebGL, cursor fluid, cycling type) are gated behind this.
 */
const QUERY =
  "(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)"

export function useRichEffects(): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const update = () => setEnabled(mql.matches)
    update()
    mql.addEventListener("change", update)
    return () => mql.removeEventListener("change", update)
  }, [])

  return enabled
}
