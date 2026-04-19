"use client"

import * as React from "react"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "@/components/theme-provider"
import { QueryProvider } from "@/components/query-provider"
import { OutletThemeProvider } from "@/components/OutletThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { DynamicDocumentTitle } from "@/components/dynamic-document-title"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <OutletThemeProvider>
            <DynamicDocumentTitle />
            {children}
            <Toaster richColors position="top-right" />
          </OutletThemeProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  )
}
