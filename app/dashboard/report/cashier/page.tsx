"use client"

import * as React from "react"
import {
  useReportSessionQuery,
} from "@/app/dashboard/report/cashier/hooks/use"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { AppPagination } from "@/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/components/use-debounce"
import { formatCurrency, formatDateTime } from "@/lib/helpers"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

export default function ReportPage() {
  /** paging + search */
  const router = useRouter()
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** data */
  const { data, isLoading } = useReportSessionQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const listData = data?.data ?? []
  const total = data?.pagination?.total
  
  /** overlays */
  const tableLoading = isLoading
  return (
    <DashboardLayout>

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Cashier</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cashier Name</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead>Total Transaction</TableHead>
                <TableHead>Total Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && listData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                listData.map((v, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{v.user?.name ?? "-"}</TableCell>
                    <TableCell className="font-medium">{formatDateTime(v.openAt, 'DD MMMM yyyy HH:mm') ?? "-"}</TableCell>
                    <TableCell className="font-medium">{formatDateTime(v.closeAt, 'DD MMMM yyyy HH:mm') ?? "-"}</TableCell>
                    <TableCell className="font-medium">{v.totalTransactions ?? "-"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(v.totalRevenue)}</TableCell>
                    <TableCell className="font-medium capitalize">
                      <div className={`${v.status === "closed" ? "text-red-500" : "text-green-500"}`}>{v.status}</div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/report/cashier/${v.id}`)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination + PerPage */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex items-center gap-2 text-sm">
            <Select
              value={String(perPage)}
              onValueChange={(v) => {
                setPerPage(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AppPagination
            page={page}
            pageSize={perPage}
            total={total}
            onPageChange={setPage}
          />
        </div>

      </div>
    </DashboardLayout>
  )
}
