"use client"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/helpers"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { useQuery } from "@tanstack/react-query"
import { getTransactionDetail  } from "@/lib/api/customer/req-api"

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

  // ✅ Fetch detail only when open & id exists
  const { data: item, isLoading } = useQuery({
    queryKey: ["transaction-detail", transactionId],
    queryFn: () => getTransactionDetail (transactionId!),
    enabled: open && !!transactionId,
  })

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: item?.data?.paymentNumber || "Receipt",
    onAfterPrint: () => onClose(),
  })

  return (
    <Sheet
      open={open}
      onOpenChange={() => onClose()}
    >
      <SheetContent
        side="right"
        className="w-[420px] p-0 rounded-l-2xl flex flex-col"
      >
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle>Order Details</SheetTitle>
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
                  Thank you for Order’s
                </h2>

                <p className="text-xs">
                  {formatDate(
                    item.data.createdAt,
                    "DD MMMM YYYY"
                  )}
                </p>
              </div>

              {/* INFO */}
              <div className="text-xs mb-2">
                <div className="flex justify-between">
                  <span>ID</span>
                  <span>{item.data.paymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer</span>
                  <span>{item.data.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table</span>
                  <span>{item.data.table?.name}</span>
                </div>
              </div>

              <hr className="my-2 border-dashed" />

              {/* ITEMS */}
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
              
              {item.data.discount && (
                <div className="flex justify-between text-xs">
                  <span>Discount</span>
                  <span>- {formatCurrency(Number(item.data.discount))}</span>
                </div>
              )}

              <hr className="my-2 border-dashed" />
              {/* belum vocer */}
              {item.data.discount && (
                <div className="flex justify-between text-xs">
                  <span>Sub Total</span>
                  <span>{formatCurrency(Number(item.data.subTotal) - Number(item.data.discount))}</span>
                </div>
              )}

              <hr className="my-2 border-dashed" />


              {item.data.tax && (
                <div className="flex justify-between text-xs">
                  <span>Tax</span>
                  <span>{formatCurrency(Number(item.data.tax))}</span>
                </div>
              )}

              {item.data.serviceCharge && (
                <div className="flex justify-between text-xs">
                  <span>Service</span>
                  <span>{formatCurrency(Number(item.data.serviceCharge))}</span>
                </div>
              )}

              {item.data.rounding && (
                <div className="flex justify-between text-xs">
                  <span>Round</span>
                  <span>{formatCurrency(Number(item.data.rounding))}</span>
                </div>
              )}

              <hr className="my-2 border-dashed" />

              <div className="flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>{formatCurrency(item.data.total)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 px-6 pb-6">
          <Button
            className="w-2/3"
            onClick={handlePrint}
            disabled={!item}
          >
            Print Receipt
          </Button>

          <Button
            className="w-1/3"
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