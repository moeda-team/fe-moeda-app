"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/helpers"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { useQuery } from "@tanstack/react-query"
import { getTransactionDetail } from "@/lib/api/customer/req-api"
import { useSession } from "next-auth/react"

type Props = {
  open: boolean
  onClose: () => void
  transactionId: string | null
}

export default function BillDrawer({
  open,
  onClose,
  transactionId,
}: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)

  const { data: session } = useSession()
  const name = session?.user?.name ?? "User"

  const { data: item, isLoading } = useQuery({
    queryKey: ["transaction-detail", transactionId],
    queryFn: () => getTransactionDetail(transactionId!),
    enabled: open && !!transactionId,
  })

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: item?.data?.paymentNumber || "Receipt",
    onAfterPrint: () => onClose(),
  })

  // ==========================
  // TEXT RECEIPT (BLUETOOTH)
  // ==========================
  const buildReceiptText = (): string => {
    if (!item) return ""

    const pad = (left: string, right: string): string => {
      const totalWidth = 32
      const space = totalWidth - left.length - right.length
      return left + " ".repeat(Math.max(space, 1)) + right
    }

    let text = ""

    text += "        MOEDA COFFEE\n"
    text += "------------------------------\n"

    text += `ID: ${item.data.paymentNumber}\n`
    text += `Customer: ${item.data.customerName}\n`
    text += `Table: ${item.data.table?.name ?? "-"}\n\n`

    item.data.subTransactions?.forEach((menu) => {
      text +=
        pad(
          `${menu.quantity}x ${menu.menuName}`,
          formatCurrency(Number(menu.subTotal))
        ) + "\n"

      if (menu.note) {
        text += `   Note: ${menu.note}\n`
      }

      if (menu.addOn) {
        text += `   ${menu.addOn}\n`
      }
    })

    text += "------------------------------\n"

    if (item.data.discount) {
      text +=
        pad("Discount", "-" + formatCurrency(Number(item.data.discount))) +
        "\n"
    }

    if (item.data.tax) {
      text += pad("Tax", formatCurrency(Number(item.data.tax))) + "\n"
    }

    if (item.data.serviceCharge) {
      text +=
        pad("Service", formatCurrency(Number(item.data.serviceCharge))) +
        "\n"
    }

    text += "------------------------------\n"
    text += pad("TOTAL", formatCurrency(item.data.total)) + "\n\n"
    text += "      TERIMA KASIH 🙏\n\n\n"

    return text
  }

  // ==========================
  // PRINT KE ANDROID
  // ==========================
  const handleBluetoothPrint = () => {
    const text = buildReceiptText()

    if (window.AndroidPrinter) {
      window.AndroidPrinter.print(text)
    } else {
      alert("❌ AndroidPrinter tidak tersedia (buka dari APK)")
    }

    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-[420px] p-0 rounded-l-2xl flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="text-center py-10">Loading...</div>
          )}

          {!isLoading && item && (
            <div
              ref={receiptRef}
              className="font-mono text-[11px]"
            >
              <div className="text-center mb-3">
                <h2 className="font-medium">MOEDA COFFEE</h2>
                <p className="text-xs">
                  {formatDate(item.data.createdAt, "DD MMMM YYYY")}
                </p>
              </div>

              <div className="text-xs mb-2">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span>{item.data.paymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer</span>
                  <span>{item.data.customerName}</span>
                </div>
              </div>

              <hr className="my-2 border-dashed" />

              {item.data.subTransactions?.map((menu, i) => (
                <div key={i} className="text-xs mb-1">
                  <div className="flex justify-between">
                    <span>
                      {menu.quantity}x {menu.menuName}
                    </span>
                    <span>
                      {formatCurrency(Number(menu.subTotal))}
                    </span>
                  </div>
                </div>
              ))}

              <hr className="my-2 border-dashed" />

              <div className="flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>{formatCurrency(item.data.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* ================= BUTTON ================= */}
        <div className="flex gap-2 px-6 pb-6">
          <Button
            className="w-1/2"
            onClick={handleBluetoothPrint}
            disabled={!item}
          >
            🔵 Print Bluetooth
          </Button>

          <Button
            className="w-1/2"
            onClick={handlePrint}
            disabled={!item}
          >
            🖨️ Print Browser
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}