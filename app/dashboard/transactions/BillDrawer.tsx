"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { TransactionOrder } from "@/lib/api/customer/req-api"
import { formatDate } from "@/lib/helpers"

type Props = {
  open: boolean
  onClose: () => void
  item: TransactionOrder | null
}

export default function BillDrawer({
  open,
  onClose,
  item,
}: Props) {

  console.log(item)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl rounded-l-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
          <div className="flex justify-between item-center px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">
              Order Details
            </h2>
            <button onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          <div className="bg-primary/10 m-6 rounded-lg border-primary border shadow-sm">
            <div className="p-6 py-4 overflow-y-auto h-[calc(100%-80px)]">
              {/* Header */}
              <div className="text-center mb-3">
                <img src="/logo.png" alt="Logo" className="w-28 h-14 mx-auto" />

                <h2 className="mt-2 font-medium">
                  Thank you for Order’s
                </h2>
                <p className="text-sm text-gray-500">
                  {formatDate(item?.createdAt || new Date(), 'DD MMMM YYYY')}
                </p>
              </div>

              {/* Info */}
              <div className="space-y-1 text-sm font-medium mb-3 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span>{item?.paymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer Name</span>
                  <span>{item?.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table</span>
                  <span>{item?.table.name}</span>
                </div>
              </div>

              <div className="space-y-1 text-lg font-medium">
                Payment Details
              </div>
              <hr className="my-2 border-dashed border-primary/50" />
              List
              <hr className="my-2 border-dashed border-primary/50" />
              

            </div>
          </div>
      </div>
    </>
  )
}