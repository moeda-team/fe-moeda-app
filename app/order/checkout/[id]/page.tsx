"use client"

import { useParams, useRouter } from "next/navigation"
import { useOrderStore } from "@/store/order.store"
import { format } from "date-fns"
import { id as localeID } from "date-fns/locale"
import QRCode from "react-qr-code"
import { HeaderWithBackground } from "@/components/public/component/HeaderWithBackground"

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()

  const getCompletedOrder = useOrderStore(
    (s) => s.getCompletedOrder
  )

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
  console.log(details)
  return (
    <div className="min-h-screen bg-gray-100 max-w-lg mx-auto pb-28">

      <HeaderWithBackground title="Feedback" url="/" />

      <div className="p-4">

        <button className="w-full bg-primary text-white py-2 rounded-lg mb-4">
          Download Receipt
        </button>

        <div className="bg-white rounded-sm p-4 shadow">

          <h2 className="text-center font-semibold text-lg">
            Thank you for Order’s
          </h2>

          <p className="text-center text-sm text-gray-500 mb-4">
            {format(
              new Date(order.paidAt),
              "dd MMMM yyyy",
              { locale: localeID }
            )}
          </p>

          <div className="flex justify-center mb-3">
            <QRCode
              value={`ORDER-${order.id}`}
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
              <span>{details.table?.name ?? 'Not Selected'}</span>
            </div>
          </div>

          <div className="pt-3 space-y-2 text-sm font-medium">
            <p className="font-semibold">
              Payment Details
            </p>

            <hr className="border-dashed my-1" />

            {details.subTransactions.map((item) => (
              <div
                key={item.id}
                className="flex justify-between"
              >
                <span>
                  {item.quantity}x {item.menuName}
                </span>
                <span>
                  Rp.{" "}
                  {(
                    item.quantity *
                    Number(item.price)
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            ))}

            <div className="flex justify-between">
              <span>Subtotal <span className="text-xs text-gray-400">({details.subTransactions.length})</span></span>
              <span>
                Rp.{" "}
                {Number(details.subTotal)
                  .toLocaleString("id-ID")}
              </span>
            </div>

            <hr className="border-dashed my-1" />

            {/* <div className="flex justify-between">
              <span>Tax</span>
              <span>
                Rp.{" "}
                {Number(details.tax)
                  .toLocaleString("id-ID")}
              </span>
            </div> */}
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>
                Rp.{" "}
                {Number(details.serviceCharge)
                  .toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Rounding</span>
              <span>
                Rp.{" "}
                {Number(details.rounding)
                  .toLocaleString("id-ID")}
              </span>
            </div>
            
            <hr className="border-dashed my-1" />

            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>
                Rp.{" "}
                {Number(details.total)
                  .toLocaleString("id-ID")}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}