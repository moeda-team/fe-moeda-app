"use client"

import * as React from "react"

type Props = {
  children: React.ReactNode
}

export function PublicLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-primary/10">
      <div className="w-full max-w-lg mx-auto bg-background min-h-screen shadow-sm">
        <main>
          {children}
        </main>
      </div>
    </div>
  )
}
