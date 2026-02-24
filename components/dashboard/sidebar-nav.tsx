"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, PanelLeft } from "lucide-react"
import { useSession } from "next-auth/react"

import type { NavGroup, NavItem } from "@/components/config/nav"
import { filterNav } from "@/lib/nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Roles } from "@/lib/api/users/req-api"

type Props = {
  groups: NavGroup[]
  onNavigate?: () => void
  collapsed?: boolean
  onToggleCollapse?: () => void
}

function NavLinkItem({
  item,
  active,
  collapsed,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  collapsed?: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon

  const link = (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      className={[
        "group relative flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
        collapsed ? "justify-center" : "gap-3",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
      ].join(" ")}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0" />}
      {!collapsed && (
        <span className="truncate transition-opacity duration-200">
          {item.title}
        </span>
      )}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">
        {item.title}
      </TooltipContent>
    </Tooltip>
  )
}

export function SidebarNav({
  groups,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
}: Props) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const role: Roles = session?.user?.role ?? "ADMIN"

  const filtered = React.useMemo(
    () => filterNav(groups, role),
    [groups, role]
  )

  const [openMap, setOpenMap] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    const nextOpen: Record<string, boolean> = {}

    for (const g of filtered) {
      for (const item of g.items) {
        if (item.children?.length) {
          const anyChildActive = item.children.some(
            (c) => c.href && pathname.startsWith(c.href)
          )
          if (anyChildActive) nextOpen[item.title] = true
        }
      }
    }

    setOpenMap((prev) => ({ ...prev, ...nextOpen }))
  }, [pathname, filtered])

  return (
    <div className="flex h-full flex-col bg-background">

      {/* ================= Header ================= */}
      <div className="flex h-14 items-center px-3 shrink-0">
        {!collapsed && (
          <div className="text-lg font-semibold">
            <img src="/logo.png" className="w-20" alt="Logo" />
          </div>
        )}

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="ml-auto rounded-md p-2 hover:bg-muted transition"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      <Separator />

      {/* ================= Navigation ================= */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-6">
          {filtered.map((g) => (
            <div key={g.label} className="space-y-2">

              {!collapsed && (
                <div className="px-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {g.label}
                </div>
              )}

              <div className="space-y-1">
                {g.items.map((item) => {
                  const isActive =
                    item.href && pathname === item.href

                  if (!item.children?.length) {
                    return (
                      <NavLinkItem
                        key={item.title}
                        item={item}
                        active={!!isActive}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                      />
                    )
                  }

                  const Icon = item.icon
                  const anyChildActive = item.children.some(
                    (c) => c.href && pathname.startsWith(c.href)
                  )

                  const open =
                    openMap[item.title] ?? anyChildActive

                  return (
                    <Collapsible
                      key={item.title}
                      open={collapsed ? false : open}
                      onOpenChange={(v) =>
                        setOpenMap((prev) => ({
                          ...prev,
                          [item.title]: v,
                        }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          className={[
                            "w-full flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200",
                            collapsed
                              ? "justify-center"
                              : "gap-3",
                            anyChildActive
                              ? "bg-muted font-medium text-foreground"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                          ].join(" ")}
                        >
                          {Icon && (
                            <Icon className="h-4 w-4 shrink-0" />
                          )}

                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left truncate">
                                {item.title}
                              </span>
                              <ChevronRight
                                className={[
                                  "h-4 w-4 transition-transform",
                                  open ? "rotate-90" : "",
                                ].join(" ")}
                              />
                            </>
                          )}
                        </button>
                      </CollapsibleTrigger>

                      {!collapsed && (
                        <CollapsibleContent className="ml-4 mt-1 space-y-1 border-l pl-4">
                          {item.children.map((c) => (
                            <NavLinkItem
                              key={c.title}
                              item={c}
                              active={
                                c.href
                                  ? pathname === c.href
                                  : false
                              }
                              collapsed={false}
                              onNavigate={onNavigate}
                            />
                          ))}
                        </CollapsibleContent>
                      )}
                    </Collapsible>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}