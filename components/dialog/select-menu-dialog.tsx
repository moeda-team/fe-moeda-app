"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import Image from "next/image"

type FetchParams = {
  page: number
  search: string
}

export type SelectMenuItem = {
  id: string
  label: string
  img: string
  description?: string
}

type FetchResult = {
  data: SelectMenuItem[]
  hasMore: boolean
}

type Props<TFieldValues extends FieldValues> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  fetchData: (params: FetchParams) => Promise<FetchResult>
  multiple?: boolean
  onSave?: (selected: string[]) => void
}

export function SelectMenuDialogPro<
  TFieldValues extends FieldValues
>({
  open,
  onOpenChange,
  title = "Select Menu",
  control,
  name,
  fetchData,
  multiple = true,
  onSave,
}: Props<TFieldValues>) {
  const [items, setItems] = React.useState<SelectMenuItem[]>([])
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [loading, setLoading] = React.useState(false)
  const [hasMore, setHasMore] = React.useState(true)

  const observerRef = React.useRef<HTMLDivElement | null>(null)

  const loadData = React.useCallback(
    async (reset = false) => {
      if (loading) return
      setLoading(true)

      try {
        const result = await fetchData({
          page: reset ? 1 : page,
          search,
        })

        setItems((prev) =>
          reset ? result.data : [...prev, ...result.data]
        )

        setHasMore(result.hasMore)
      } finally {
        setLoading(false)
      }
    },
    [fetchData, page, search, loading]
  )

  React.useEffect(() => {
    if (!open) return
    setPage(1)
    loadData(true)
  }, [open])

  React.useEffect(() => {
    if (!open) return
    const t = setTimeout(() => {
      setPage(1)
      loadData(true)
    }, 400)

    return () => clearTimeout(t)
  }, [search])

  React.useEffect(() => {
    if (!observerRef.current) return
    if (!hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1 }
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore])

  React.useEffect(() => {
    if (page === 1) return
    loadData()
  }, [page])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Search menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            const selected: string[] = field.value ?? []

            const toggle = (id: string) => {
              if (!multiple) {
                field.onChange([id])
                return
              }

              if (selected.includes(id)) {
                field.onChange(
                  selected.filter((v) => v !== id)
                )
              } else {
                field.onChange([...selected, id])
              }
            }

            return (
              <>
                <ScrollArea className="h-[400px] border rounded-md mt-3">
                  <div className="p-3 space-y-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2 p-2 justify-between rounded-md hover:bg-muted cursor-pointer"
                        onClick={() => toggle(item.id)}
                      >
                        <div className="flex rounded gap-2">
                          <div className="relative h-16 w-16">
                            <Image
                              src={item.img}
                              alt={item.label}
                              fill
                              className="rounded object-cover"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {item.label}
                            </span>
                            {item.description && (
                              <span className="text-xs text-muted-foreground">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {multiple && (
                          <Checkbox
                            checked={selected.includes(
                              item.id
                            )}
                          />
                        )}
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    )}

                    {!loading && items.length === 0 && (
                      <div className="text-center text-sm text-muted-foreground py-6">
                        No menu found
                      </div>
                    )}

                    <div ref={observerRef} />
                  </div>
                </ScrollArea>

                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>

                  <Button
                    onClick={() => {
                      onSave?.(selected)
                      onOpenChange(false)
                    }}
                    disabled={selected.length === 0}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </>
            )
          }}
        />
      </DialogContent>
    </Dialog>
  )
}