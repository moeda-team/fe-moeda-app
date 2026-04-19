"use client"

import { useOutletTheme } from "@/hooks/useOutletTheme"

export function OutletThemeProvider({ children }: { children: React.ReactNode }) {
  useOutletTheme()
  return <>{children}</>
}
