"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { formatCurrency, formatCurrencySimple, formatDate } from "@/lib/helpers"

import { useRef } from "react"
import { useReactToPrint } from "react-to-print"
import { useQuery } from "@tanstack/react-query"
import { getTransactionDetail  } from "@/lib/api/customer/req-api"
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
  const { data: session, status } = useSession()
  const user = session?.user
  const name = user?.name ?? "User"

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
    text += center("MOEDA")
    text += center("COFFEE & SPACE")
    text += "\n"
    text += center("Thank you for Order's")
    text += center(formatDate(item.data.createdAt, "DD MMM YYYY"))
    text += "\n"

    // ================= INFO =================
    text += pad("ID", item.data.paymentNumber)
    text += pad("Customer", item.data.customerName)
    text += pad("Table", item.data.table?.name ?? "-")

    text += line()

    // ================= ITEMS =================
    item.data.subTransactions?.forEach((menu) => {
      text += pad(
        `${menu.quantity}x ${menu.menuName}`,
        formatCurrencySimple(Number(menu.subTotal))
      )

      text += `Note : ${menu.note || "-"}\n`
    })

    text += line()

    // ================= SUMMARY =================
    if (item.data.discount) {
      text += pad("Discount", "-" + formatCurrencySimple(Number(item.data.discount)))
    }

    if (item.data.subTotal && item.data.discount) {
      text += pad(
        "Sub Total",
        formatCurrencySimple(Number(item.data.subTotal) - Number(item.data.discount))
      )
    }

    if (item.data.tax) {
      // text += pad("Tax", formatCurrencySimple(Number(item.data.tax)))
      text += pad("Tax", formatCurrencySimple(Number(0)))
    }

    if (item.data.serviceCharge) {
      text += pad("Service", formatCurrencySimple(Number(item.data.serviceCharge)))
    }

    if (item.data.rounding) {
      text += pad("Round", formatCurrencySimple(Number(item.data.rounding)))
    }

    text += line()

    text += pad("Total", formatCurrencySimple(item.data.total))

    text += "\n\n"

    // ================= DUPLICATE SECTION =================
    text += line()

    text += pad("Order ID", item.data.paymentNumber)
    text += pad(
      "Waktu",
      formatDate(item.data.createdAt, "DD MMM YYYY HH:mm")
    )
    text += pad("Customer", item.data.customerName)
    text += pad("Table", item.data.table?.name ?? "-")

    text += line()

    item.data.subTransactions?.forEach((menu) => {
      text += `${menu.quantity}x ${menu.menuName}\n`
      text += `Note : ${menu.note || "-"}\n`
    })

    text += line()

    text += center(formatDate(item.data.createdAt, "DD MMM YYYY HH:mm"))
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
                <div key={i} className="text-xs mb-1 flex flex-col pb-1">
                  <div className="flex justify-between">
                    <span>
                      {menu.quantity}x {menu.menuName}
                    </span>
                    <span>
                      {formatCurrencySimple(Number(menu.subTotal))}
                    </span>
                  </div>
                  
                  <div className="text-xs">
                    Note : {menu.note || "-"}
                  </div>
                  <div className="text-xs">
                    {menu?.addOn && (
                      <div className="flex flex-wrap gap-1 capitalize">
                        {menu.addOn.split(',').map((addOn, index) => {
                          const [type, ...values] = addOn.trim().split('_')
                          const value = values.join('_')
                          return (
                            <div
                              key={index}
                              className="text-xs border-r pr-1 border-black last:border-0"
                            >
                              {type} : {value.replaceAll("_", " ")}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {item.data.discount && (
                <div className="flex justify-between text-xs">
                  <span>Discount</span>
                  <span>- {formatCurrencySimple(Number(item.data.discount))}</span>
                </div>
              )}

              <hr className="my-2 border-dashed" />
              {/* belum vocer */}
              {item.data.discount && (
                <div className="flex justify-between text-xs">
                  <span>Sub Total</span>
                  <span>{formatCurrencySimple(Number(item.data.subTotal) - Number(item.data.discount))}</span>
                </div>
              )}

              <hr className="my-2 border-dashed" />


              {item.data.tax && (
                <div className="flex justify-between text-xs">
                  <span>Tax</span>
                  {/* <span>{formatCurrencySimple(Number(item.data.tax))}</span> */}
                  <span>{formatCurrencySimple(Number(0))}</span>
                </div>
              )}

              {item.data.serviceCharge && (
                <div className="flex justify-between text-xs">
                  <span>Service</span>
                  <span>{formatCurrencySimple(Number(item.data.serviceCharge))}</span>
                </div>
              )}

              {item.data.rounding && (
                <div className="flex justify-between text-xs">
                  <span>Round</span>
                  <span>{formatCurrencySimple(Number(item.data.rounding))}</span>
                </div>
              )}

              <hr className="my-2 border-dashed" />

              <div className="flex justify-between font-semibold text-sm">
                <span>Total</span>
                <span>{formatCurrencySimple(item.data.total)}</span>
              </div>
              <br />
              <hr style={{color:'white'}}/>
              <br />
              <hr style={{color:'white'}}/>
              <br />

              <div className="flex flex-col ">
                {/* ITEMS */}
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span>{item.data.paymentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu</span>
                  <span>{
                    formatDate(
                      item.data.createdAt,
                      "DD MMMM YYYY HH:ss"
                    )
                  }</span>
                </div>
                <div className="flex justify-between">
                  <span>Customer</span>
                  <span>{item.data.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Table</span>
                  <span>{item.data.table?.name}</span>
                </div>

                <div className="border-dashed border border-gray-600 my-2"/>

                {item.data.subTransactions?.map((menu, i) => (
                  <div key={i} className="text-xs mb-1 flex flex-col pb-1">
                    <div className="flex justify-between">
                      <span>
                        {menu.quantity}x {menu.menuName}
                      </span>
                    </div>
                    
                    <div className="text-xs">
                      Note : {menu.note || "-"}
                    </div>
                    <div className="text-xs">
                      {menu?.addOn && (
                        <div className="flex flex-wrap gap-1 capitalize">
                          {menu.addOn.split(',').map((addOn, index) => {
                            const [type, ...values] = addOn.trim().split('_')
                            const value = values.join('_')
                            return (
                              <div
                                key={index}
                                className="text-xs border-r pr-1 border-gray-700 last:border-0"
                              >
                                {type} : {value.replaceAll("_", " ")}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <div className="border-dashed border border-gray-600 mb-2"/>
                <div className="flex justify-center">
                  <span>{
                    formatDate(
                      item.data.createdAt,
                      "DD MMMM YYYY HH:ss"
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