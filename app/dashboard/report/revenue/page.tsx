"use client"

import * as React from "react"
import {
  useReportQuery,
  useCreateReport,
  useUpdateReport,
  useDeleteReport,
  useDownloadReport,
} from "@/app/dashboard/report/revenue/hooks/use"
import type { ReportItem } from "@/lib/api/report/req-api"

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
import { LoadingOverlay } from "@/components/ui/loading"

import { toast } from "sonner"
import { getErrorMessage } from "@/lib/toast-error"
import { useDebounce } from "@/components/use-debounce"
import { ConfirmDialog } from "@/components/dialog/confirm-dialog"
import { formatCurrency, formatDate } from "@/lib/helpers"
import { DollarSign, ShoppingBasket, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

export default function ReportPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)
  
  const today = new Date().toISOString().split("T")[0]
  const [startDate, setStartDate] = React.useState(today)
  const [endDate, setEndDate] = React.useState(today)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedReport, setSelectedReport] = React.useState<ReportItem | null>(null)
  const { mutate: mutatedownloadReport, isPending } = useDownloadReport()

  /** data */
  const { data, isLoading } = useReportQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
    start_date: formatDate(startDate, "yyyy-MM-DD"),
    end_date: formatDate(endDate, "yyyy-MM-DD"),
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateReport()
  const updateMut = useUpdateReport()
  const deleteMut = useDeleteReport()

  const handleConfirmDelete = async () => {
    if (!selectedReport) return

    try {
      await deleteMut.mutateAsync(selectedReport.id??"")
      toast.success(`Cash dihapus`)
      setConfirmOpen(false)
      setSelectedReport(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const listData = data?.data?.details ?? []
  const total = data?.pagination?.total
  
  /** overlays */
  const fullscreenLoading = createMut.isPending || updateMut.isPending || deleteMut.isPending || isPending

  const downloadReport = () => {
    mutatedownloadReport(formatDate(startDate, "yyyy-MM-DD"))
  }

  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={fullscreenLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Revenue</h1>

          <div className="flex gap-2">
            {/* <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            /> */}
            <Input
              type="date"
              placeholder="Start Date"
              className="w-full sm:w-40"
              disabled={fullscreenLoading}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setPage(1)
              }}
            />
            <Input
              type="date"
              placeholder="End Date"
              className="w-full sm:w-40"
              disabled={fullscreenLoading}
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setPage(1)
              }}
            />
            {/* download report */}
            {/* <Button 
              onClick={downloadReport}
            >
              Download
            </Button> */}
          </div>
        </div>

        {/* card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-amber-200 px-2 py-2">
                    <Sparkles color="orange"/>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    Total Revenue
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-start px-2">
                <div className="text-xl font-bold">{formatCurrency(data?.data.totalRevenue ?? 0)}</div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground font-medium px-2">
                {data?.data?.totalTransactions} Transactions
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-2">
                    <DollarSign color="green"/>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    Total Client Revenue
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-start px-2">
                <div className="text-xl font-bold">{formatCurrency(data?.data.clientRevenue ??  0)}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-2">
                    <DollarSign color="green"/>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    Total System Revenue
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-start px-2">
                <div className="text-xl font-bold">{formatCurrency(data?.data.systemRevenue ??  0)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative overflow-auto p-4 bg-secondary shadow-sm rounded-lg border space-y-2">
          <div className="p-2 shadow-sm rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Client Revenue</TableHead>
                  <TableHead>System Revenue</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Paymnent</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!isLoading && listData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No data
                    </TableCell>
                  </TableRow>
                ) : (
                    listData.map((v, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{v.orderId ?? "-"}</TableCell>
                        <TableCell className="font-medium">{v.date ?? "-"}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(v.clientRevenue)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(v.systemRevenue)}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(v.total)}</TableCell>
                        <TableCell className="font-medium">{v.paymentMethod ?? "-"}</TableCell>
                        <TableCell className="font-medium capitalize">
                          <div className={`${v.status === "pending" ? "text-yellow-500" : v.status === "completed" ? "text-green-500" :"text-red-500"}`}>{v.status}</div>
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

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete data?"
          description={
            <>
              Data will be deleted permanently.
            </>
          }
          confirmText="Delete"
          confirmVariant="destructive"
          loading={deleteMut.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
