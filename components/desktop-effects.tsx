"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { useRichEffects } from "@/lib/use-rich-effects"

const SplashCursor = dynamic(() => import("@/components/SplashCursor"), { ssr: false })

/** Mounts the fluid cursor only on desktop, and only after the page is idle. */
export default function DesktopEffects() {
  const rich = useRichEffects()
  const [idle, setIdle] = useState(false)

  useEffect(() => {
    if (!rich) return
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setIdle(true), { timeout: 2500 })
      return () => w.cancelIdleCallback?.(id)
    }
    const t = window.setTimeout(() => setIdle(true), 1500)
    return () => window.clearTimeout(t)
  }, [rich])

  if (!rich || !idle) return null
  return <SplashCursor />
}
