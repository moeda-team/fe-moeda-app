"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function DynamicDocumentTitle() {
  const { data: session } = useSession()
  
  useEffect(() => {
    const outletName = session?.outlet?.name || "Moeda"
    const title = `${outletName} - Coffee & Space`
    
    if (typeof window !== "undefined") {
      document.title = title
    }
  }, [session?.outlet?.name])

  return null // This component only updates the document title
}
