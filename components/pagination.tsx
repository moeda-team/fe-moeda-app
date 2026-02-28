"use client"

import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"

type Props = {
  /** page saat ini (1-based) */
  page: number

  /** item per page */
  pageSize: number

  /** total item (recommended) */
  total?: number

  /** fallback kalau backend belum kirim total */
  hasNext?: boolean

  onPageChange: (page: number) => void
}

export function AppPagination({
  page,
  pageSize,
  total,
  hasNext,
  onPageChange,
}: Props) {
  const totalPages =
    typeof total === "number"
      ? Math.max(1, Math.ceil(total / pageSize))
      : undefined

  const canPrev = page > 1
  const canNext =
    typeof totalPages === "number"
      ? page < totalPages
      : Boolean(hasNext)

  const pages = React.useMemo(() => {
    if (!totalPages || totalPages <= 7) {
      return totalPages
        ? Array.from({ length: totalPages }, (_, i) => i + 1)
        : []
    }

    const start = Math.max(1, page - 2)
    const end = Math.min(totalPages, page + 2)

    const result: Array<number | "..."> = []

    if (start > 1) {
      result.push(1)
      if (start > 2) result.push("...")
    }

    for (let i = start; i <= end; i++) {
      result.push(i)
    }

    if (end < totalPages) {
      if (end < totalPages - 1) result.push("...")
      result.push(totalPages)
    }

    return result
  }, [page, totalPages])
  console.log(pageSize)
  console.log(total)
  if (!totalPages) return null

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (canPrev) onPageChange(page - 1)
            }}
            aria-disabled={!canPrev}
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "..." ? (
            <PaginationItem key={`dots-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(p)
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault()
              if (canNext) onPageChange(page + 1)
            }}
            aria-disabled={!canNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
