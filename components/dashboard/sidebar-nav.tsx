"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { useSession } from "next-auth/react"

import type { NavGroup, NavItem, UserRole } from "@/components/config/nav"
import { filterNav } from "@/lib/nav"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

type Props = {
  groups: NavGroup[]
  onNavigate?: () => void
}

function NavLinkItem({
  item,
  active,
  onNavigate,
  className,
}: {
  item: NavItem
  active: boolean
  onNavigate?: () => void
  className?: string
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href ?? "#"}
      onClick={onNavigate}
      className={[
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
        active
          ? "bg-muted font-medium"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        className ?? "",
      ].join(" ")}
    >
      {Icon ? <Icon className="h-4 w-4" /> : null}
      <span className="truncate">{item.title}</span>
    </Link>
  )
}

export function SidebarNav({ groups, onNavigate }: Props) {
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // role real dari session (hasil /v1/me mapping kamu)
  const role: UserRole = session?.user?.role ?? "user"

  // saat loading, kita bisa sementara treat sebagai "user"
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
    <ScrollArea className="h-full">
      <div className="p-3">
        <div className="px-2 py-2 text-sm font-semibold">Admin Shadcn</div>

        <Separator className="my-2" />

        <div className="space-y-4">
          {filtered.map((g) => (
            <div key={g.label} className="space-y-2">
              <div className="px-2 text-xs font-medium text-muted-foreground">
                {g.label}
              </div>

              <div className="space-y-1">
                {g.items.map((item) => {
                  const isActive = item.href ? pathname === item.href : false

                  // No children
                  if (!item.children?.length) {
                    return (
                      <NavLinkItem
                        key={item.title}
                        item={item}
                        active={isActive}
                        onNavigate={onNavigate}
                      />
                    )
                  }

                  // With children => collapsible
                  const Icon = item.icon
                  const anyChildActive = item.children.some(
                    (c) => c.href && pathname.startsWith(c.href)
                  )
                  const open = openMap[item.title] ?? anyChildActive

                  return (
                    <Collapsible
                      key={item.title}
                      open={open}
                      onOpenChange={(v) =>
                        setOpenMap((prev) => ({ ...prev, [item.title]: v }))
                      }
                    >
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          className={[
                            "w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                            anyChildActive
                              ? "bg-muted font-medium"
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                          ].join(" ")}
                        >
                          {Icon ? <Icon className="h-4 w-4" /> : null}
                          <span className="flex-1 text-left truncate">
                            {item.title}
                          </span>
                          <ChevronRight
                            className={[
                              "h-4 w-4 transition-transform",
                              open ? "rotate-90" : "rotate-0",
                            ].join(" ")}
                          />
                        </button>
                      </CollapsibleTrigger>

                      <CollapsibleContent className="mt-1 ml-3 space-y-1 border-l pl-3">
                        {item.children.map((c) => (
                          <NavLinkItem
                            key={c.title}
                            item={c}
                            active={c.href ? pathname === c.href : false}
                            onNavigate={onNavigate}
                            className="py-1.5"
                          />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}
