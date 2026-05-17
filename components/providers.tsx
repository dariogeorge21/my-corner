"use client"

import { ReactLenis } from 'lenis/react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ReactLenis root options={{ lerp: 0.05, duration: 1.5, smoothWheel: true }}>
        {children}
      </ReactLenis>
    </NextThemesProvider>
  )
}