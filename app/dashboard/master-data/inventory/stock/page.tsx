"use client"

import * as React from "react"
import {
  useTransactionsQuery,
  useUpdateTransaction,
} from "@/app/dashboard/transactions/list/hooks/use"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Input } from "@/components/ui/input"
import { LoadingOverlay } from "@/components/ui/loading"

import { toast } from "sonner"
import { getErrorMessage } from "@/lib/toast-error"
import { useDebounce } from "@/components/use-debounce"
import { Badge } from "@/components/ui/badge"
import { AlertOctagon, BadgeCheck, CircleDivideIcon, Clock, List, PrinterCheck, ShoppingBag, TriangleAlert } from "lucide-react"
import { useLiveTimeAgo } from "@/lib/useLiveTimeAgo"
import { TransactionOrder } from "@/lib/api/customer/req-api"
import { diffMinutes, formatCurrency, formatTime } from "@/lib/helpers"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function StockListPage() {
  /** paging + search */
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const debouncedSearch = useDebounce(search, 400)
  const [activeTab, setActiveTab] = React.useState("inprogress")

  /** data */
  const { data } = useTransactionsQuery({
    page: 1,
    perPage: 10,
    search: debouncedSearch,
    status: "active",
    paymentStatus: "completed"
  })
  const { data : dataCompleted } = useTransactionsQuery({
    page: 1,
    perPage: 10,
    search: debouncedSearch,
    status: "completed"
  })

  /** mutations */
  const updateMut = useUpdateTransaction()

  const transactions = data?.data?.transactions ?? []
  const transactionsCompleted = dataCompleted?.data?.transactions ?? []

  /** overlays */
  const fullscreenLoading = updateMut.isPending || isLoading

  const handleUpdateStatus = async (
    subTransactionId: string,
    status: string
  ) => {
    try {
      await updateMut.mutateAsync({
        id: subTransactionId,
        input: {
          status,
        },
      })

      toast.success("Status updated")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }
  const [openBill, setOpenBill] = React.useState(false)
  const [billItems, setBillItems] = React.useState<TransactionOrder>()
  
  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={fullscreenLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Stock</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
          </div>
        </div>

        <hr />

        {/* card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-2">
                    <BadgeCheck color="green"/>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Safe
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end px-2">
                <div className="text-xl font-bold">1</div>
                <div className="text-sm font-medium text-muted-foreground">item</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-amber-200 px-2 py-2">
                    <TriangleAlert color="orange"/>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Low
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end px-2">
                <div className="text-xl font-bold">1</div>
                <div className="text-sm font-medium text-muted-foreground">item</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-red-100 px-2 py-2">
                    <AlertOctagon color="red"/>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Out
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end px-2">
                <div className="text-xl font-bold">1</div>
                <div className="text-sm font-medium text-muted-foreground">item</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* table */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ingredient Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>#</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {transactionsCompleted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                transactionsCompleted.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.table.name ?? 'No selected'}</TableCell>
                    <TableCell className="font-medium">
                      <div>{v.customerName}</div>
                      <div className="text-muted-foreground">{v.paymentNumber}</div></TableCell>
                    <TableCell className="font-medium">{v.subTransactions.length}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(Number(v.total))}</TableCell>
                    <TableCell className="font-medium capitalize">
                      <Badge
                        variant="outline"
                        className={cn(
                          "cursor-pointer capitalize",
                          v.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-[#F3A93B]/10 text-primary"
                        )}
                      >
                        {v.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      <Button   
                        variant="outline"  
                        size="icon"
                        onClick={() => {
                          setOpenBill(true)
                          setBillItems(v)
                        }}
                      >
                        <PrinterCheck />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </DashboardLayout>
  )
}
