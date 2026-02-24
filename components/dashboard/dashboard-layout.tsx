"use client"

import * as React from "react"
import { NAV } from "@/components/config/nav"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Topbar } from "@/components/dashboard/top-bar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type Props = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: Props) {
  const [openMobile, setOpenMobile] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(false)
  const [hovered, setHovered] = React.useState(false)

  const hoverTimeout = React.useRef<NodeJS.Timeout | null>(null)

  const isExpanded = !collapsed || hovered

  const handleMouseEnter = () => {
    if (!collapsed) return

    hoverTimeout.current = setTimeout(() => {
      setHovered(true)
    }, 200) // 🔥 delay biar gak flicker
  }

  const handleMouseLeave = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current)
      hoverTimeout.current = null
    }

    setHovered(false)
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="flex min-h-screen">

        {/* ================= Desktop Sidebar ================= */}
        <aside
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={[
            "hidden lg:flex lg:flex-col border-r bg-background sticky top-0 h-screen",
            "transition-all duration-300 ease-in-out",
            isExpanded ? "lg:w-64 shadow-lg" : "lg:w-16",
          ].join(" ")}
        >
          <SidebarNav
            groups={NAV}
            collapsed={!isExpanded}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        </aside>

        {/* ================= Mobile Sidebar ================= */}
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent side="left" className="p-0 w-[280px]">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <SidebarNav
              groups={NAV}
              onNavigate={() => setOpenMobile(false)}
            />
          </SheetContent>
        </Sheet>

        {/* ================= Main ================= */}
        <div className="flex flex-1 flex-col min-w-0">
          <Topbar onOpenSidebarMobile={() => setOpenMobile(true)} />

          <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}