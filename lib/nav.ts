import type { NavGroup, NavItem, UserRole } from "@/components/config/nav"

function canSee(item: NavItem, role: UserRole) {
  return !item.roles || item.roles.includes(role)
}

function filterItem(item: NavItem, role: UserRole): NavItem | null {
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

export function filterNav(groups: NavGroup[], role: UserRole): NavGroup[] {
  return groups
    .map((g) => {
      const items = g.items
        .map((i) => filterItem(i, role))
        .filter((x): x is NavItem => Boolean(x))
      return { ...g, items }
    })
    .filter((g) => g.items.length > 0)
}
