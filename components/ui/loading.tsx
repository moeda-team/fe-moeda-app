"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type Props = {
  /** tampilkan overlay */
  show: boolean

  /** teks kecil di bawah spinner */
  label?: string

  /** cover full screen (fixed) atau hanya parent container (absolute) */
  fullscreen?: boolean

  /** kalau overlay dipakai di container, parent harus punya class "relative" */
  className?: string
}

export function LoadingOverlay({
  show,
  label = "Loading...",
  fullscreen = false,
  className,
}: Props) {
  if (!show) return null

  return (
    <div
      className={cn(
        fullscreen
          ? "fixed inset-0 z-[9999]"
          : "absolute inset-0 z-50",
        "flex items-center justify-center",
        className
      )}
      aria-live="polite"
      aria-busy="true"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-background/10 backdrop-blur-xs" />

      {/* content */}
      <div className="relative flex flex-col items-center gap-2 rounded-xl border bg-background px-4 py-3 shadow">
        <Loader2 className="h-5 w-5 animate-spin" />
        {label ? (
          <div className="text-sm text-muted-foreground">{label}</div>
        ) : null}
      </div>
    </div>
  )
}
