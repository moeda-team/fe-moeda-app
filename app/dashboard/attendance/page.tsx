"use client"

import * as React from "react"
import {
  useAttendanceQuery,
} from "@/app/dashboard/attendance/hooks/use"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
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
import { formatDate } from "@/lib/helpers"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { AttendanceItem } from "@/lib/api/users/req-api"


const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

export default function AttendancePage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const today = new Date().toISOString().split("T")[0]
  const [date, setDate] = React.useState(today)
  const debouncedSearch = useDebounce(search, 400)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<AttendanceItem | null>(null)

  /** data */
  const { data, isLoading } = useAttendanceQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
    date: formatDate(date, "yyyy-MM-DD"),
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const attendance = data?.data?.data ?? []
  const total = data?.data?.pagination?.total

  const tableLoading = isLoading

  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Attendance List</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={tableLoading}
            />
            <Input
              type="date"
              className="w-full sm:w-80"
              disabled={tableLoading}
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setPage(1)
              }}
            />
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Photo</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                attendance.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.user.name}</TableCell>
                    <TableCell className="font-medium">{formatDate(v.createdAt, "DD, MMMM yyyy")}</TableCell>
                    <TableCell className="font-medium">
                      <img 
                        src={v.fileUrl} 
                        alt="" 
                        className="w-20 h-20 rounded-xl cursor-pointer" 
                        onClick={() => {
                          setSelected(v)
                          setDetailOpen(true)
                        }}/>
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
              disabled={tableLoading}
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
        
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Detail Attendance</DialogTitle>
            </DialogHeader>

            {selected && (
              <div className="space-y-4">
                <img
                  src={selected.fileUrl}
                  alt="Attendance"
                  className="rounded-lg border w-full"
                />

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium">Nama:</span>{" "}
                    {selected.user?.name}
                  </div>
                  <div>
                    <span className="font-medium">Tanggal:</span>{" "}
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>

                  {selected.note && (
                    <div>
                      <span className="font-medium">Note:</span>{" "}
                      {selected.note}
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setDetailOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
