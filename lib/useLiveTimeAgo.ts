// src/hooks/useLiveTimeAgo.ts

"use client"

import { useEffect, useState } from "react"
import moment, { MomentInput } from "moment"

export function useLiveTimeAgo(date: MomentInput) {
  const [timeAgo, setTimeAgo] = useState("")

  useEffect(() => {
    if (!date) return

    const update = () => {
      setTimeAgo(moment(date).fromNow())
    }

    update() // initial run

    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [date])

  return timeAgo
}