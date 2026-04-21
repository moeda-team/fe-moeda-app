"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Attendance } from "./attendance"

type Props = {
  onOpenSidebarMobile: () => void
}

function breadcrumbFromPath(pathname: string) {
  const parts = pathname.split("/").filter(Boolean)
  return parts.length ? parts : ["dashboard"]
}

export function Topbar({ onOpenSidebarMobile }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const crumbs = breadcrumbFromPath(pathname)

  const { data: session, status } = useSession()

  const user = session?.user
  const name = user?.name ?? "User"
  const role = user?.role ?? "user"
  const avatar = user?.image ?? null

  const logout = async () => {
    // 1️⃣ Hapus local storage
    if (typeof window !== "undefined") {
      localStorage.clear()
      sessionStorage.clear()
    }

    // 2️⃣ Hapus cookie manual (optional - kalau ada custom cookie)
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=")
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    })

    // 3️⃣ Sign out next-auth
    await signOut({ redirect: false })

    // 4️⃣ Redirect pakai replace biar gak bisa back
    router.replace("/login")

    // 5️⃣ Force refresh state
    router.refresh()
  }

  return (
    <div className="flex h-14 items-center justify-between border-b bg-background px-3 md:px-6">

      {/* ================= Left Section ================= */}
      <div className="flex items-center gap-3 min-w-0">

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={onOpenSidebarMobile}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumb */}
        <div className="hidden md:block min-w-0">
          <div className="truncate text-sm text-muted-foreground capitalize">
            {crumbs.join(" / ").replaceAll("-", " ")}
          </div>
        </div>
      </div>

      {/* ================= Right Section ================= */}
      <div className="flex items-center gap-2 md:gap-4">

        <Attendance />
        <ModeToggle />

        {status !== "loading" && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-2 md:px-3"
              >
                <Avatar className="h-7 w-7">
                  {avatar ? (
                    <AvatarImage src={avatar} alt={name} />
                  ) : (
                    <AvatarFallback>
                      {name.slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>

                <span className="hidden sm:block text-sm truncate max-w-[120px]">
                  {name}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Role:{" "}
                <span className="font-medium text-foreground">
                  {role}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => router.push("/dashboard/profile")}
              >
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}