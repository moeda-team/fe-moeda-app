"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { formatCurrencySimple, formatDate } from "@/lib/helpers"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { getTransactionDetailReport } from "@/lib/api/report/req-api"

type Props = {
  open: boolean
  onClose: () => void
  transactionId: string | null
}

export default function PrintDrawer({
  open,
  onClose,
  transactionId,
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const user = session?.user
  const name = user?.name ?? "User"

  // ✅ Fetch detail only when open & id exists
  const { data: item, isLoading } = useQuery({
    queryKey: ["transaction-detail-report", transactionId],
    queryFn: () => getTransactionDetailReport(transactionId!),
    enabled: open && !!transactionId,
  })

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: item?.data?.reportInfo?.title || "Receipt",
    onAfterPrint: () => onClose(),
  })
  
  const buildReceiptText = (): string => {
    if (!item) return ""

    const width = 32

    const center = (text: string) => {
      const space = Math.floor((width - text.length) / 2)
      return " ".repeat(Math.max(space, 0)) + text + "\n"
    }

    const pad = (left: string, right: string) => {
      const space = width - left.length - right.length
      return left + " ".repeat(Math.max(space, 1)) + right + "\n"
    }

    const line = () => "--------------------------------\n"

    let text = ""

    // ================= HEADER =================
    text += center(item.data.storeInfo.name)
    text += center(item.data.storeInfo.address)
    text += "\n"
    text += center(item.data.reportInfo.title)
    text += center(formatDate(item.data.reportInfo.closeAt, "DD MMM YYYY"))
    text += "\n"

    // ================= INFO =================
    text += pad("Cashier", item.data.reportInfo.cashierName)
    text += pad("Open", formatDate(item.data.reportInfo.openAt, "HH:mm"))
    text += pad("Close", formatDate(item.data.reportInfo.closeAt, "HH:mm"))

    text += line()

    // ================= SALES TRANSACTION REPORT =================
    text += center(item.data.salesTransactionReport.title)
    text += line()
    
    text += pad("Initial Capital", formatCurrencySimple(item.data.salesTransactionReport.initialCapital))
    text += pad("Cash", formatCurrencySimple(item.data.salesTransactionReport.paymentMethods.cash))
    text += pad("Transfer", formatCurrencySimple(item.data.salesTransactionReport.paymentMethods.transfer))
    text += pad("Debit", formatCurrencySimple(item.data.salesTransactionReport.paymentMethods.transferDetails.DEBIT))
    text += pad("Total Revenue", formatCurrencySimple(item.data.salesTransactionReport.totalRevenue))
    text += pad("Final Balance", formatCurrencySimple(item.data.salesTransactionReport.finalBalance))

    text += line()

    // ================= TRANSACTION COUNTS =================
    text += pad("Completed", item.data.salesTransactionReport.transactionCounts.completed.toString())
    text += pad("Unpaid", item.data.salesTransactionReport.transactionCounts.unpaid.toString())

    text += line()

    // ================= ADJUSTMENTS =================
    text += pad("Total Tax", formatCurrencySimple(item.data.salesTransactionReport.adjustments.totalTax))
    text += pad("Service Charge", formatCurrencySimple(item.data.salesTransactionReport.adjustments.totalServiceCharge))
    text += pad("Rounding", formatCurrencySimple(item.data.salesTransactionReport.adjustments.totalRounding))

    text += line()
    text += line()
    text += line()

    // ================= MENU SALES REPORT =================
    text += center(item.data.menuSalesReport.title)
    text += line()

    item.data.menuSalesReport.items.forEach((menuItem) => {
      text += pad(
        `${menuItem.quantity}x ${menuItem.menuName}`,
        formatCurrencySimple(menuItem.totalAmount)
      )
    })

    text += line()
    text += center(formatDate(item.data.reportInfo.closeAt, "DD MMM YYYY HH:mm"))
    text += center(name)

    text += "\n\n\n"

    return text
  }

  const handleUniversalPrint = () => {
    // ✅ ANDROID (APK)
    if (window.AndroidPrinter) {
      const text = buildReceiptText()

      if (!text) {
        alert("Data kosong")
        return
      }

      window.AndroidPrinter.print(text)
      onClose()
      return
    }

    // 🌐 WEB fallback
    handlePrint()
  }

  return (
    <Sheet
      open={open}
      onOpenChange={() => onClose()}
    >
      <SheetContent
        side="right"
        className="w-full p-0 rounded-l-2xl flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Close Order Details</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">

          {isLoading && (
            <div className="text-center py-10">
              Loading...
            </div>
          )}

          {!isLoading && item && (
            <div
              ref={receiptRef}
              className="receipt-print font-mono text-[11px]"
            >
              {/* HEADER */}
              <div className="text-center mb-3">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-28 h-14 mx-auto"
                />

                <h2 className="mt-2 font-medium">
                  {item.data.storeInfo.name}
                </h2>

                <p className="text-xs">
                  {item.data.storeInfo.address}
                </p>

                <h3 className="mt-2 font-medium">
                  {item.data.reportInfo.title}
                </h3>

                <p className="text-xs">
                  {formatDate(
                    item.data.reportInfo.closeAt,
                    "DD MMMM YYYY"
                  )}
                </p>
              </div>

              {/* CASHIER INFO */}
              <div className="text-xs mb-2">
                <div className="flex justify-between">
                  <span>Cashier</span>
                  <span className="text-center">{item.data.reportInfo.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Open</span>
                  <span className="text-center">{formatDate(item.data.reportInfo.openAt, "HH:mm")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Close</span>
                  <span className="text-center">{formatDate(item.data.reportInfo.closeAt, "HH:mm")}</span>
                </div>
              </div>

              <hr className="my-2 border-dashed" />

              {/* SALES TRANSACTION REPORT */}
              <div className="text-xs mb-2">
                <div className="font-semibold text-center mb-2">
                  {item.data.salesTransactionReport.title}
                </div>
                <div className="flex justify-between">
                  <span>Initial Capital</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.initialCapital)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cash</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.paymentMethods.cash)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transfer</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.paymentMethods.transfer)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Debit</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.paymentMethods.transferDetails.DEBIT)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.totalRevenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Final Balance</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.finalBalance)}</span>
                </div>
              </div>

              <hr className="my-2 border-dashed" />

              {/* TRANSACTION COUNTS */}
              <div className="text-xs mb-2">
                <div className="flex justify-between">
                  <span>Completed</span>
                  <span>{item.data.salesTransactionReport.transactionCounts.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unpaid</span>
                  <span>{item.data.salesTransactionReport.transactionCounts.unpaid}</span>
                </div>
              </div>

              <hr className="my-2 border-dashed" />

              {/* ADJUSTMENTS */}
              <div className="text-xs mb-2">
                <div className="flex justify-between">
                  <span>Total Tax</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.adjustments.totalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charge</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.adjustments.totalServiceCharge)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rounding</span>
                  <span>{formatCurrencySimple(item.data.salesTransactionReport.adjustments.totalRounding)}</span>
                </div>
              </div>

              <hr className="my-2 border-dashed" />
              <br />
              <br />

              {/* MENU SALES REPORT */}
              <div className="text-xs mb-4">
                <div className="font-semibold text-center mb-3">
                  {item.data.menuSalesReport.title}
                </div>
                {item.data.menuSalesReport.items.map((menuItem, i) => (
                  <div key={i} className="flex justify-between mb-2 py-1">
                    <span className="flex-1">
                      {menuItem.quantity}x {menuItem.menuName}
                    </span>
                    <span className="ml-4">
                      {formatCurrencySimple(menuItem.totalAmount)}
                    </span>
                  </div>
                ))}
              </div>

              <br />
              <hr style={{color:'white'}}/>
              <br />
              <hr style={{color:'white'}}/>
              <br />

              <div className="flex flex-col ">
                <div className="flex justify-center">
                  <span>{
                    formatDate(
                      item.data.reportInfo.closeAt,
                      "DD MMMM YYYY HH:mm"
                    )
                  }</span>
                </div>
                <div className="flex justify-center">
                  <span>{name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 px-6 pb-6">
          {/* <Button
            className="w-1/3 dark:text-white"
            onClick={handleSilentPrint}
            disabled={!item}
            variant="secondary"
          >
            Print (1)
          </Button> */}
          
          <Button
            className="w-1/2 dark:text-white"
            onClick={handleUniversalPrint}
            disabled={!item}
          >
            Print
          </Button>

          <Button
            className="w-1/2"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}