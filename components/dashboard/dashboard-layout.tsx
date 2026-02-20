"use client"

import * as React from "react"
import { NAV } from "@/components/config/nav"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { Topbar } from "@/components/dashboard/top-bar"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

type Props = {
  children: React.ReactNode
}

export function DashboardLayout({ children }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:block w-64 border-r bg-background h-screen sticky top-0">
          <SidebarNav groups={NAV}/>
        </aside>

        {/* Mobile sidebar (Sheet = Dialog) => MUST HAVE SheetTitle */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left" className="p-0 w-72">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>

            <SidebarNav
              groups={NAV}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* Main */}
        <div className="flex-1">
          <Topbar onOpenSidebarMobile={() => setOpen(true)}/>
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
