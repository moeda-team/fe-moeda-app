import { Roles } from "@/lib/api/users/req-api"
import type { LucideIcon } from "lucide-react"
import { LayoutDashboard, Users, TicketPercent, ListCheck, List, Menu, Folder, RockingChair, StickyNote, Wallet } from "lucide-react"


export type NavItem = {
  title: string
  href?: string
  icon?: LucideIcon
  roles?: Roles[]
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
      {
        title: "Transactions",
        icon: List,
        roles: ["ADMIN", "OWNER", "STORE_MANAGER", "EMPLOYEE"],
        children: [
          { title: "List", href: "/dashboard/transactions/list", roles: ["ADMIN", "OWNER", "STORE_MANAGER", "EMPLOYEE"] },
          { title: "Order", href: "/dashboard/transactions/order", roles: ["ADMIN", "OWNER", "STORE_MANAGER", "EMPLOYEE"] },
        ],
      },
      { title: "Cash / Balance", href: "/dashboard/cash", icon: Wallet },
      { title: "Report", href: "/dashboard/report", icon: StickyNote },
    ],
  },
  {
    label: "Master Data",
    items: [
      {
        title: "Inventory",
        icon: Folder,
        roles: ["ADMIN", "OWNER", "STORE_MANAGER", "EMPLOYEE"],
        children: [
          { title: "Ingredients", href: "/dashboard/master-data/inventory/ingridients", roles: ["ADMIN", "OWNER", "STORE_MANAGER", "EMPLOYEE"] },
          { title: "Activity / Stock", href: "/dashboard/master-data/inventory/activity", roles: ["ADMIN", "OWNER", "STORE_MANAGER", "EMPLOYEE"] },
        ],
      },
      {
        title: "Menu",
        icon: Menu,
        roles: ["ADMIN", "OWNER"],
        children: [
          { title: "List", href: "/dashboard/master-data/menu", roles: ["ADMIN", "OWNER"] },
          { title: "Category", href: "/dashboard/master-data/menu/categories", roles: ["ADMIN", "OWNER"] },
        ],
      },
      {
        title: "Outlet",
        icon: ListCheck,
        href: "/dashboard/outlet",
        roles: ["ADMIN"],
      },
      {
        title: "Tables",
        icon: RockingChair,
        href: "/dashboard/master-data/tables",
        roles: ["ADMIN", "OWNER"],
      },
      {
        title: "Users",
        icon: Users,
        roles: ["ADMIN", "OWNER"],
        children: [
          { title: "List", href: "/dashboard/master-data/users", roles: ["ADMIN", "OWNER"] },
        ],
      },
      {
        title: "Voucher / Discount",
        icon: TicketPercent,
        roles: ["ADMIN", "OWNER"],
        children: [
          { title: "Discount", href: "/dashboard/master-data/discount", roles: ["ADMIN", "OWNER"] },
          { title: "Voucher", href: "/dashboard/master-data/voucher", roles: ["ADMIN", "OWNER"] },
        ],
      },
    ],
  },
]
