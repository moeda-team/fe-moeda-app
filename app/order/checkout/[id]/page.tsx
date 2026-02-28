"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useOrderStore } from "@/store/order.store"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import QRCode from "react-qr-code"
import { HeaderWithBackground } from "@/components/public/component/HeaderWithBackground"
import jsPDF from "jspdf"

function FeedbackPage() {
  const [mounted, setMounted] = useState(false)

  const params = useParams()
  const router = useRouter()

  const getCompletedOrder = useOrderStore(
    (s) => s.getCompletedOrder
  )

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
    }, 100)
  }, [])

  if (!mounted) return null

  const orderId = Array.isArray(params.id)
    ? params.id[0]
    : params.id

  if (!orderId) return null

  const order = getCompletedOrder(orderId)

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p>Order not found</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-primary underline"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const details = order.details
  const generateQRBase64 = async (value: string) => {
    const QRCodeLib = await import("qrcode")

    return await QRCodeLib.toDataURL(value, {
      width: 200,
      margin: 1,
    })
  }

  const generatePDF = async () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 200],
    })

    let y = 10

    doc.setFontSize(14)
    doc.text("Thank You For Your Order", 40, y, { align: "center" })

    y += 8

    doc.setFontSize(10)
    doc.text(
      format(new Date(order.paidAt), "dd MMMM yyyy", {
        locale: localeID,
      }),
      40,
      y,
      { align: "center" }
    )

    y += 5

    // =========================
    // QR CODE SECTION
    // =========================
    const qrBase64 = await generateQRBase64(`${process.env.REACT_APP_URL}/order/detail/${order.id}`)

    doc.addImage(qrBase64, "PNG", 25, y, 30, 30)

    y += 35

    doc.setFontSize(9)
    doc.text(`Order ID: ${details.number}`, 5, y)
    y += 5

    doc.text(`Customer: ${details.customerName}`, 5, y)
    y += 5

    doc.text(`Table: ${details.table?.name ?? "Not Selected"}`, 5, y)
    y += 8

    doc.line(5, y, 75, y)
    y += 6

    details.subTransactions.forEach((item) => {
      doc.text(`${item.quantity}x ${item.menuName}`, 5, y)

      doc.text(
        `Rp ${Number(item.subTotal).toLocaleString("id-ID")}`,
        75,
        y,
        { align: "right" }
      )

      y += 5
    })

    y += 4
    doc.line(5, y, 75, y)
    y += 6

    doc.text("Subtotal", 5, y)
    doc.text(
      `Rp ${Number(details.subTotal).toLocaleString("id-ID")}`,
      75,
      y,
      { align: "right" }
    )
    y += 5

    doc.text("Discount", 5, y)
    doc.text(
      `- Rp ${Number(details.discount).toLocaleString("id-ID")}`,
      75,
      y,
      { align: "right" }
    )
    y += 5

    doc.text("Tax", 5, y)
    doc.text(
      `Rp ${Number(details.tax).toLocaleString("id-ID")}`,
      75,
      y,
      { align: "right" }
    )
    y += 5

    doc.text("Service Fee", 5, y)
    doc.text(
      `Rp ${Number(details.serviceCharge).toLocaleString("id-ID")}`,
      75,
      y,
      { align: "right" }
    )
    y += 5

    doc.text("Rounding", 5, y)
    doc.text(
      `Rp ${Number(details.rounding).toLocaleString("id-ID")}`,
      75,
      y,
      { align: "right" }
    )
    y += 6

    doc.line(5, y, 75, y)
    y += 8

    doc.setFontSize(11)
    doc.text("TOTAL", 5, y)

    doc.text(
      `Rp ${Number(details.total).toLocaleString("id-ID")}`,
      75,
      y,
      { align: "right" }
    )

    doc.save(`receipt-${order.id}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-100 max-w-lg mx-auto pb-28">
      <HeaderWithBackground title="Feedback" url="/" />

      <div className="p-4">
        <button
          onClick={generatePDF}
          className="w-full bg-primary text-white py-2 rounded-lg mb-4"
        >
          Download PDF
        </button>

        {/* UI tetap sama seperti sebelumnya */}
        
        <div
          className="bg-white rounded-sm p-6 shadow-sm border border-gray-200 font-medium print:shadow-none print:border-none"
        >
          <h2 className="text-center font-semibold text-lg">
            Thank you for Order’s
          </h2>

          <p className="text-center text-sm text-gray-500 mb-2">
            {format(
              new Date(order.paidAt),
              "dd MMMM yyyy",
              { locale: localeID }
            )}
          </p>

          <div className="flex justify-center mb-3">
            <QRCode
              value={`${process.env.REACT_APP_URL}/order/detail/${order.id}`}
              size={120}
            />
          </div>

          <p className="text-center text-xs text-gray-400 mb-4">
            Scan here to view your order’s
          </p>

          <div className="text-sm space-y-1 mb-2 text-gray-500">
            <div className="flex justify-between">
              <span>Order ID</span>
              <span>{details.number}</span>
            </div>

            <div className="flex justify-between">
              <span>Customer Name</span>
              <span>{details.customerName}</span>
            </div>

            <div className="flex justify-between">
              <span>Table</span>
              <span>{details.table?.name ?? "Not Selected"}</span>
            </div>
          </div>

          <div className="pt-3 space-y-1 text-sm font-medium">
            <p className="font-semibold">Payment Details</p>

            <hr className="border-dashed my-2" />

            {details.subTransactions.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {item.quantity}x {item.menuName}
                </span>
                <span>
                  Rp {Number(item.subTotal).toLocaleString("id-ID")}
                </span>
              </div>
            ))}

            <div className="flex justify-between">
              <span>
                Subtotal{" "}
                <span className="text-xs text-gray-400">
                  ({details.subTransactions.length})
                </span>
              </span>
              <span>
                Rp {Number(details.subTotal).toLocaleString("id-ID")}
              </span>
            </div>

            <hr className="border-dashed my-2" />

            <div className="flex justify-between text-red-500 print:text-black">
              <span>Discount (Menu + Voucher)</span>
              <span>
                - Rp {Number(details.discount).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>
                Rp {Number(details.tax).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>
                Rp {Number(details.serviceCharge).toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Rounding</span>
              <span>
                Rp {Number(details.rounding).toLocaleString("id-ID")}
              </span>
            </div>

            <hr className="border-dashed my-1" />

            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>
                Rp {Number(details.total).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default dynamic(() => Promise.resolve(FeedbackPage), {
  ssr: false,
})