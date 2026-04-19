"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function DynamicDocumentTitle() {
  const { data: session, status } = useSession()
  
  useEffect(() => {
    // Debug: Log session state
    console.log("DynamicDocumentTitle - Session:", { session, status })
    
    // Wait for session to be loaded
    if (status === "loading") return
    
    const outletName = session?.outlet?.name || "XPOS"
    const title = `${outletName} - Coffee & Space`
    
    console.log("DynamicDocumentTitle - Setting title:", title)
    
    if (typeof window !== "undefined") {
      document.title = title
    }
  }, [session, status, session?.outlet?.name])

  return null // This component only updates the document title
}
