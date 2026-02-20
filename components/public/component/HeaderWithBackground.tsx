"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import * as React from "react"

type Props = {
  title: string
  backgroundImage?: string
  showBackButton?: boolean
  rightElement?: React.ReactNode
}

export function HeaderWithBackground({
  title,
  backgroundImage = "/images/header.png",
  showBackButton = true,
  rightElement,
}: Props) {
  const router = useRouter()

  return (
    <div
      className="relative text-white px-4 py-5"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "top center",
      }}
    >
      {/* Overlay biar text lebih jelas */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Back Button */}
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 cursor-pointer"
        >
          <ArrowLeft />
        </button>
      )}

      {/* Title */}
      <h1 className="text-center font-semibold text-xl relative z-20">
        {title}
      </h1>

      {/* Optional Right Element */}
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          {rightElement}
        </div>
      )}
    </div>
  )
}