"use client"

import { useSession } from "next-auth/react"

export function DynamicTitle() {
  const { data: session } = useSession()
  const outletName = session?.outlet?.name || "XPOS"
  
  return `${outletName ? outletName + " - " : ""} Coffee & Space`
}
