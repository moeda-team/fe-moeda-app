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
import { Clock, List, PrinterCheck, ShoppingBag } from "lucide-react"
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
import BillDrawer from "../BillDrawer"

function TransactionCard({
  transaction,
  handleUpdateStatus,
  type,
  setOpenBill,
  setBillItems
}: {
  transaction: TransactionOrder
  handleUpdateStatus: (subTransactionId: string, status: string) => void
  type? : string
  setOpenBill: React.Dispatch<React.SetStateAction<boolean>>
  setBillItems: React.Dispatch<React.SetStateAction<TransactionOrder | undefined>>
}) {
  const timeAgo = useLiveTimeAgo(transaction.createdAt)
  const [showAll, setShowAll] = useState(false)

  const items = transaction.subTransactions ?? []

  const visibleItems = showAll ? items : items.slice(0, 0)
  const [openPopoverId, setOpenPopoverId] = React.useState<string | null>(null)
  const handleCompleteAll = async () => {
    try {
      const preparationItems = transaction.subTransactions.filter(
        (item) => item.status === "preparation"
      )

      if (preparationItems.length === 0) return

      await Promise.all(
        preparationItems.map((item) =>
          handleUpdateStatus(item.id, "completed")
        )
      )

      toast.success("Semua pesanan diselesaikan")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-primary/20 flex flex-col gap-2 justify-between">
      <div className="space-y-2">
        {/* HEADER */}
        <div>
          <div className="flex justify-between items-center">
            <div className="text-sm font-semibold">
              {transaction?.table?.name ?? "Table"}
            </div>

            <Badge
              variant="outline"
              className={` flex items-center gap-1 ${type === "completed" ? "bg-green-100 text-green-700" : "bg-[#F3A93B]/10 text-[#F3A93B]"}`}
            >
              <Clock size={14} />
              {type=== "completed"? diffMinutes(transaction.createdAt, transaction.updatedAt) + " Minutes":timeAgo}
            </Badge>
          </div>

          {/* CUSTOMER */}
          <div className="flex justify-between text-sm pt-2">
            <div className="text-sm">
              {transaction?.customerName}
            </div>
            <div>
              {transaction?.paymentNumber}
            </div>
          </div>
        </div>

        {/* SUBTOTAL */}
        <div className="flex justify-between text-sm font-medium border-t pt-2">
          <span>
            Subtotal ({items.length} menu)
          </span>
          <span>
            {formatCurrency(Number(transaction.total), "id-ID")}
          </span>
        </div>

        {/* SHOW ALL TOGGLE */}
        {items.length > 0 && (
          <div
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center text-xs mt-1 cursor-pointer text-primary font-bold select-none"
          >
            {showAll ? "Show Less" : "Show All"}
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </div>
        )}

        {/* LIST MENU */}
        <div className="text-sm space-y-2">
          {visibleItems.map((item) => {
            const nextStatus =
              item.status === "preparation"
                ? "completed"
                : "preparation"

            return (
              <div
                key={item.id}
                className="flex justify-between items-center"
              >
                <span
                  title={item.menu?.name}
                  className="cursor-pointer"
                >
                  {item.menu?.name.length > 20
                    ? item.menu?.name.slice(0, 20) + "..."
                    : item.menu?.name}{" "}
                  x{item.quantity}
                </span>
                {type !== 'completed' ? (
                  <Popover
                    open={openPopoverId === item.id}
                    onOpenChange={(open) =>
                      setOpenPopoverId(open ? item.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Badge
                        variant="outline"
                        className={cn(
                          "cursor-pointer capitalize",
                          item.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-[#F3A93B]/10 text-primary"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </PopoverTrigger>

                    <PopoverContent className={`w-32 p-0 text-center hover:text-primary hover:bg-gray-100 ${nextStatus === "completed" ? "bg-green-100 text-green-700 hover:bg-muted" : "bg-primary text-white"}`}>
                      <button
                        onClick={() =>{ 
                          handleUpdateStatus(item.id, nextStatus)
                          // 🔥 auto close
                          setOpenPopoverId(null)
                        }}
                        className="w-full text-sm text-center  px-2 py-1 rounded-sm capitalize"
                      >
                        {nextStatus}
                      </button>
                    </PopoverContent>
                  </Popover>
                ) :
                  <Badge
                    variant="outline"
                    className={cn(
                      "cursor-pointer capitalize",
                      item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-[#F3A93B]/10 text-primary"
                    )}
                  >
                    {item.status}
                  </Badge>
                }
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="grid lg:flex gap-2">
        <Button 
          size="sm"
          className={`lg:w-10/12 w-full dark:text-white ${type === "completed" ? 'bg-gray-500' :""}`}
          disabled={type === "completed"}
          onClick={handleCompleteAll}
        >
          {type === "completed" ? `Selesai ${formatTime(transaction.updatedAt)}` : "Selesaikan semua pesanan"}
        </Button>
        <Button   
          variant="outline"  
          size="icon"
          className="lg:w-2/12 w-full"
          onClick={() => {
            setOpenBill(true)
            setBillItems(transaction)
          }}
        >
          <PrinterCheck />
        </Button>
      </div>
    </div>
  )
}

export default function TransactionsListPage() {
  /** paging + search */
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const debouncedSearch = useDebounce(search, 400)
  const [activeTab, setActiveTab] = React.useState("inprogress")

  /** data */
  const { data } = useTransactionsQuery({
    search: debouncedSearch,
    status: "active",
    paymentStatus: "completed"
  })
  const { data : dataCompleted } = useTransactionsQuery({
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
          <h1 className="text-2xl font-semibold">Transactions</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />

            {/* <Tabs  
              defaultValue="inprogress" 
              value={activeTab}
              className="space-y-4"
              onValueChange={
                (value) => {
                  setActiveTab(value)
                  setSearch("")
                  setIsLoading(true)
                  setTimeout(() => {
                    setIsLoading(false)
                  }, 1000);
                }
              }
            >
              <TabsList className="bg-primary/10">
                <TabsTrigger value="inprogress" className="text-primary">
                  <List />
                  List Transaksi
                </TabsTrigger>
                <TabsTrigger value="history" className="text-primary">
                  <ShoppingBag />
                  History
                </TabsTrigger>
              </TabsList>
            </Tabs> */}
          </div>
        </div>

        <hr />

        {/* Tab List Traksaksi */}
        {activeTab === 'inprogress' && (
          <div className="relative rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* inprogress */}
              <div className="col-span-1 lg:col-span-2 space-y-2 p-4 bg-transparent rounded-xl shadow-sm border border-primary/20 max-h-[calc(100vh-200px)] overflow-auto">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">In progress</div>
                  <div className="text-sm text-muted-foreground">
                    {transactions.length} transactions
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transactions.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} handleUpdateStatus={handleUpdateStatus} setOpenBill={setOpenBill} setBillItems={setBillItems}/>
                  ))}
                </div>

                <div className="relative">
                  {transactions.length === 0 && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                      <img src="/empty.png" alt="empty" width={200} height={200} />
                      <div className="text-center text-muted-foreground text-xl">
                        No transactions preparation
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* completed */}
              <div className="col-span-1 space-y-2 p-4 bg-transparent rounded-xl shadow-sm border border-primary/20  max-h-[calc(100vh-200px)] overflow-auto">
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold">Completed</div>
                  <div className="text-sm text-muted-foreground">
                    {transactionsCompleted.length} transactions
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {transactionsCompleted.map((transaction) => (
                    <TransactionCard key={transaction.id} transaction={transaction} handleUpdateStatus={handleUpdateStatus} type="completed" setOpenBill={setOpenBill} setBillItems={setBillItems}/>
                  ))}
                </div>

                <div className="relative">
                  {transactionsCompleted.length === 0 && (
                    <div className="flex flex-col justify-center items-center w-full h-full">
                      <img src="/empty.png" alt="empty" width={200} height={200} />
                      <div className="text-center text-muted-foreground text-xl">
                        No transactions completed
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Lis History */}

        {activeTab === 'history' && (
          <div className="relative rounded-xl border bg-background overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table</TableHead>
                  <TableHead>Order Name</TableHead>
                  <TableHead>Total Menu</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Transaction Type</TableHead>
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
                      <TableCell className="font-medium capitalize">{v.paymentMethod}</TableCell>
                      <TableCell className="font-medium capitalize">{v.transactionType}</TableCell>
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
        )}

        <BillDrawer
          open={openBill}
          onClose={() => setOpenBill(false)}
          transactionId={billItems?.id ?? null}
        />
      </div>
    </DashboardLayout>
  )
}
