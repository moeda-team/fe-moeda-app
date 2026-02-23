import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Users, TicketPercent } from "lucide-react"

export type UserRole = "ADMIN" | "USER" | "OWNER" | "CHASIER"

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
        roles: ["ADMIN", "OWNER"],
        children: [
          { title: "List", href: "/dashboard/users", roles: ["ADMIN", "OWNER"] },
        ],
      },
      {
        title: "Voucer / Discount",
        icon: TicketPercent,
        roles: ["ADMIN", "OWNER"],
        children: [
          { title: "Voucher", href: "/dashboard/master-data/voucher", roles: ["ADMIN", "OWNER"] },
          { title: "Discount", href: "/dashboard/master-data/discount", roles: ["ADMIN", "OWNER"] },
        ],
      },
    ],
  },
]
