import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Users } from "lucide-react"

export type UserRole = "ADMIN" | "USER"

export type NavItem = {
  title: string
  href?: string
  icon?: LucideIcon
  roles?: UserRole[]
  children?: NavItem[]
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV: NavGroup[] = [
  {
    label: "Main",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard },
    ],
  },
  {
    label: "Master Data",
    items: [
      {
        title: "Users",
        icon: Users,
        roles: ["ADMIN"],
        children: [
          { title: "List", href: "/users", roles: ["ADMIN"] },
        ],
      },
    ],
  },
]
