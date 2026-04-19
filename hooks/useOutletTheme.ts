"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function useOutletTheme() {
  const { data: session } = useSession()

  useEffect(() => {
    if (!session?.outlet?.color) return

    const root = document.documentElement
    const outletColor = session.outlet.color

    // Apply outlet color as primary color
    root.style.setProperty('--primary', outletColor)
    
    // Generate complementary colors for better contrast
    const hsl = hexToHSL(outletColor)
    const complementary = getComplementaryColor(hsl)
    
    // Apply to dark mode as well
    root.style.setProperty('--primary', outletColor)
    
  }, [session?.outlet?.color])
}

// Helper functions
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  
  let h = 0, s = 0 
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 }
}

function getComplementaryColor(hsl: { h: number; s: number; l: number }): string {
  const complementaryH = (hsl.h + 180) % 360
  return `hsl(${complementaryH}, ${hsl.s}%, ${hsl.l}%)`
}
