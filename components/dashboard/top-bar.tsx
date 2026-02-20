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
    await signOut({ redirect: false })
    router.replace("/login")
    router.refresh()
  }

  return (
    <div className="flex h-14 items-center gap-3 border-b bg-background px-4">
      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={onOpenSidebarMobile}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <div className="text-sm text-muted-foreground capitalize">
          {crumbs.join(" / ")}
        </div>
      </div>

      <ModeToggle />

      {/* Jangan render dropdown sebelum session siap */}
      {status === "loading" ? null : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Avatar className="h-6 w-6">
                {avatar ? (
                  <AvatarImage src={avatar} alt={name} />
                ) : (
                  <AvatarFallback>
                    {name.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <span className="hidden sm:block text-sm">{name}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Role:{" "}
              <span className="font-medium text-foreground">{role}</span>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
