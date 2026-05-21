"use client"

import { ReactLenis } from 'lenis/react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </NextThemesProvider>
  )
}