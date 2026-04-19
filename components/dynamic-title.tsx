"use client"

import { useSession } from "next-auth/react"

export function DynamicTitle() {
  const { data: session } = useSession()
  const outletName = session?.outlet?.name || "Moeda"
  
  return `${outletName} - Coffee & Space`
}
