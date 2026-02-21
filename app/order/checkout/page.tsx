"use client"

import { useState } from "react"
import { useCartStore } from "@/store/cart.store"
import { HeaderWithBackground } from "@/components/public/component/HeaderWithBackground"
import { EditCustomerDrawer } from "./EditCustomerDrawer"
import { useCustomerStore } from "@/store/customer.store"
import { ChevronDown, List, ListOrdered } from "lucide-react"

export default function CheckoutPage() {

  /**
   * =========================
   * ZUSTAND
   * =========================
   */
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal)
  const totalDiscount = useCartStore((s) => s.totalDiscount)

  /**
   * =========================
   * CUSTOMER (LOCAL STORAGE)
   * =========================
   */
  const { name, table, hasHydrated } = useCustomerStore()

  /**
   * =========================
   * LOCAL STATE
   * =========================
   */
  const [voucherCode, setVoucherCode] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("qris")
  const [showAll, setShowAll] = useState(false)

  /**
   * =========================
   * HYDRATION GUARD
   * =========================
   */
  if (!hasHydrated) return null

  /**
   * =========================
   * PRICING
   * =========================
   */
  const sub = subtotal()
  const discount = totalDiscount()

  const tax = sub * 11 / 100
  const service = sub * 2 / 100

  const grandTotal = Math.max(
    sub - discount + tax + service,
    0
  )

  return (
    <div className="min-h-screen bg-gray-100 max-w-lg mx-auto pb-28">

      <HeaderWithBackground title="Checkout Detail" />

      <div className="px-4 py-4 space-y-4">

        {/* ========================= */}
        {/* CUSTOMER INFO */}
        {/* ========================= */}
        <div className="bg-white rounded-sm p-3 shadow-sm relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#F3A93B] text-xl text-white font-semibold p-2 h-10 w-10 flex items-center justify-center">
                {table}
              </div>

              <div>
                <p className="text-sm">Customer</p>
                <p className="font-semibold text-base">
                  {name}{" "}
                  <label className="text-xs font-normal">
                    (Table {table})
                  </label>
                </p>
              </div>
            </div>

            <EditCustomerDrawer />
          </div>

          <hr className="my-3 border-gray-300" />

          {/* PAYMENT DETAILS */}
          <div>
            <div className="flex items-center gap-2 text-base">
              <List className="w-6 h-6 text-white bg-primary rounded-sm p-1" />
              Payment Details
            </div>

            <hr className="my-2 border-gray-300 border-dashed" />

            <div className="flex justify-between text-sm">
              <span>Subtotal ({items.length} menu)</span>
              <span>Rp {sub.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* SHOW ALL BUTTON */}
          <div
            onClick={() => setShowAll((prev) => !prev)}
            className="flex items-center text-xs my-2 cursor-pointer text-primary font-bold select-none"
          >
            {showAll ? "Show Less" : "Show All"}
            <ChevronDown
              className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                showAll ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* COLLAPSIBLE ITEM LIST */}
          <div
            className={`transition-all duration-300 overflow-hidden ${
              showAll ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-1"
                >
                  <div>
                    <div className="font-medium">
                      {item.name} x{item.qty}
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {item.options
                        ? Object.values(item.options)
                            .flat()
                            .join(", ")
                        : ""}
                    </div>
                  </div>

                  <div className="font-semibold">
                    Rp{" "}
                    {item.finalPrice.toLocaleString("id-ID")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* VOUCHER */}
        {/* ========================= */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="font-semibold mb-3">Voucher</p>

          <div className="flex gap-2">
            <input
              value={voucherCode}
              onChange={(e) =>
                setVoucherCode(e.target.value)
              }
              placeholder="Masukkan Kode Voucher"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button className="bg-primary text-white px-4 rounded-lg text-sm">
              Pakai
            </button>
          </div>
        </div>

        {/* ========================= */}
        {/* PAYMENT METHOD */}
        {/* ========================= */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="font-semibold mb-3">
            Select Payment Method
          </p>

          {["qris", "gopay", "ovo"].map((method) => (
            <div
              key={method}
              onClick={() => setPaymentMethod(method)}
              className="flex justify-between items-center py-2 cursor-pointer"
            >
              <span className="capitalize">
                {method}
              </span>

              <div
                className={`w-4 h-4 rounded-full border ${
                  paymentMethod === method
                    ? "bg-primary border-primary"
                    : "border-gray-400"
                }`}
              />
            </div>
          ))}
        </div>

        {/* ========================= */}
        {/* SUMMARY */}
        {/* ========================= */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-2 text-sm">

          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>Rp {sub.toLocaleString("id-ID")}</span>
          </div>

          <div className="flex justify-between text-red-500">
            <span>Discount</span>
            <span>
              - Rp {discount.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Tax 10%</span>
            <span>
              Rp {tax.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Service Fee 2%</span>
            <span>
              Rp {service.toLocaleString("id-ID")}
            </span>
          </div>

          <div className="border-t pt-2 flex justify-between font-semibold text-base">
            <span>Total to Pay</span>
            <span>
              Rp {grandTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>

      {/* ========================= */}
      {/* STICKY PAYMENT BUTTON */}
      {/* ========================= */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white px-4 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => alert("Proceed Payment")}
          className="w-full bg-[#B87333] text-white py-3 rounded-lg font-semibold"
        >
          Payment Rp{" "}
          {grandTotal.toLocaleString("id-ID")}
        </button>
      </div>
    </div>
  )
}