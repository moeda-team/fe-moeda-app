"use client"

import { Metadata } from "next"
import { DynamicTitle } from "@/components/dynamic-title"

export async function generateMetadata(): Promise<Metadata> {
  const DynamicTitleComponent = DynamicTitle
  const title = DynamicTitleComponent()
  
  return {
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description: "Author by Al",
  }
}

export default function DynamicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
