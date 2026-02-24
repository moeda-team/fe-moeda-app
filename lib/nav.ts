import type { NavGroup, NavItem } from "@/components/config/nav"
import { Roles } from "./api/users/req-api"

function canSee(item: NavItem, role: Roles) {
  return !item.roles || item.roles.includes(role)
}

function filterItem(item: NavItem, role: Roles): NavItem | null {
  if (!canSee(item, role)) return null

  if (item.children?.length) {
    const children = item.children
      .map((c) => filterItem(c, role))
      .filter((x): x is NavItem => Boolean(x))

    if (!children.length) return null
    return { ...item, children }
  }

  return item
}

export function filterNav(groups: NavGroup[], role: Roles): NavGroup[] {
  return groups
    .map((g) => {
      const items = g.items
        .map((i) => filterItem(i, role))
        .filter((x): x is NavItem => Boolean(x))
      return { ...g, items }
    })
    .filter((g) => g.items.length > 0)
}
