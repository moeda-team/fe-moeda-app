"use client"

import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-xl border bg-background p-6 space-y-3">
        <h1 className="text-2xl font-semibold">500 — Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          Terjadi kesalahan tidak terduga
        </p>
        <Button onClick={reset} className="dark:text-white">Coba lagi</Button>
      </div>
    </div>
  )
}
