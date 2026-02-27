"use client"

import { useEffect, useState } from "react"
import { useCartStore } from "@/store/cart.store"
import { HeaderWithBackground } from "@/components/public/component/HeaderWithBackground"
import { EditCustomerDrawer } from "./EditCustomerDrawer"
import { useCustomerStore } from "@/store/customer.store"
import { ChevronDown, List, TicketPercent } from "lucide-react"
import { useVoucher } from "./hooks/useVoucher"
import { PaymentMethodSelector } from "./PaymentMethodSelector"
import { useCreateTransaction } from "./hooks/useTransactions"
import { CreateTransactionInput, getTransactionCalculate } from "@/lib/api/customer/req-api"
import { toast } from "sonner"
import axios from "axios"
import { TransactionQrDrawer } from "./TransactionQrDrawer"
import LoadingScreen from "@/components/loading"
import { useQuery } from "@tanstack/react-query"
import { useTablesQuery } from "@/app/dashboard/master-data/tables/hooks/use"
import { mappingOption } from "@/lib/option-utils"

export default function CheckoutPage() {

  /**
   * =========================
   * ZUSTAND
   * =========================
   */
  const items = useCartStore((s) => s.items)
  const subtotalFn = useCartStore((s) => s.totalFinal)
  const nSubtotal = useCartStore((s) => s.subtotal)
  const totalDiscountFn = useCartStore((s) => s.totalDiscount)

  /**
   * =========================
   * CUSTOMER STORE
   * =========================
   */
  const name = useCustomerStore((s) => s.name)
  const table = useCustomerStore((s) => s.table)
  const hasHydrated = useCustomerStore((s) => s.hasHydrated)

  /**
   * =========================
   * LOCAL STATE
   * =========================
   */
  const [paymentMethod, setPaymentMethod] = useState("qris")
  const [showAll, setShowAll] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  /**
   * =========================
   * PRICING BASE
   * =========================
   */
  const sub = subtotalFn()
  const nSub = nSubtotal()
  const cartDiscount = totalDiscountFn()
  const { mutate, isPending } = useCreateTransaction()
  const [isBlocking, setIsBlocking] = useState(true)
  
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isBlocking) return

      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isBlocking])
  /**
   * =========================
   * VOUCHER
   * =========================
   */
  const {
    code,
    setCode,
    voucher,
    loading,
    applyVoucher,
    removeVoucher,
    discountAmount,
  } = useVoucher(sub)

  const { data: transactionData } = useQuery({
    queryKey: ["transaction-calculate", discountAmount, sub],
    queryFn: () =>
      getTransactionCalculate(
        paymentMethod!,
        nSub,
        Number(discountAmount),
        cartDiscount,
      ),
    enabled: !!paymentMethod,
  })

  const { data : TABLE_OPTIONS } = useTablesQuery({
    page : 1,
    perPage : 1000,
    search: "",
  })
  

  /**
   * =========================
   * HYDRATION GUARD
   * =========================
   */
  if (!hasHydrated) return null

  /**
   * =========================
   * PAYMENT
   * =========================
   */

  const handlePayment = () => {
    setQrOpen(true)
    setPaymentMethod('qris')
    const FIVE_MINUTES = 5 * 60 * 1000
    const expireTimestamp = Date.now() + FIVE_MINUTES
    localStorage.setItem("paymentExpiredAt", expireTimestamp.toString())
    localStorage.removeItem("transactionId")
    localStorage.removeItem("qrGenerated")
    localStorage.removeItem("expireTimestamp")

    const payload : CreateTransactionInput = {
      outletId : process.env.NEXT_PUBLIC_OUTLET_ID ?? '',
      transactionType : "dine-in",
      tableId : table,
      paymentMethod : paymentMethod,
      customerName : name,
      discount : transactionData?.data.discount ?? 0,
      additionalNote : "",
      voucher : code,
      cart : items.map((item) => ({
          menuId : item.menuId,
          menuName : item.name,
          quantity : item.qty,
          discount : item.discountAmount,
          price : item.basePrice,
          subTotal : item.subtotal + Number(item.discountAmount),
          addOn : item?.options ? Object.values(item.options).flat().join(", ") : "",
          addOnPrice : item.extraPrice,
          note : item.note ?? ""
      })) ?? []
    }

    mutate(payload, {
      onSuccess: (data) => {
        if(data){
          setQrOpen(true)
          setPaymentMethod(data.data.paymentMethod)
          localStorage.setItem("transactionId", data.data.paymentNumber)
        }
      },
      onError: (error) => {
        if(axios.isAxiosError(error)){
          toast.error(error?.response?.data?.message)
        }
      }
    })
  }

  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return "N/A"

    const parts = name.trim().split(/\s+/)

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }

    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  console.log(transactionData)
  return (
    <div className="min-h-screen bg-gray-100 max-w-lg mx-auto pb-28">

      <HeaderWithBackground title="Checkout Detail" />

      <div className="px-4 py-4 space-y-4">

        {/* CUSTOMER INFO */}
        <div className="bg-white rounded-sm p-3 shadow-sm relative">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-[#F3A93B] text-lg text-white font-semibold p-2 h-10 w-10 flex items-center justify-center">
                {getInitials(name)}
              </div>

              <div>
                <p className="text-sm">Customer</p>
                <p className="font-semibold text-base">
                  {name}{" "}
                  <span className="text-xs font-normal">
                    ({table ? TABLE_OPTIONS?.data?.find((t) => t.id === table)?.name : "Not Selected"})
                  </span>
                </p>
                {!name && <p className="text-xs text-red-500">Please select customer</p>}
              </div>
            </div>

            <EditCustomerDrawer tableOptions={TABLE_OPTIONS?.data ?? []}/>
          </div>
        </div>

        <div className="bg-white rounded-sm p-3 shadow-sm flex flex-col gap-2">
          {/* PAYMENT DETAILS */}
          <div>
            <div className="flex items-center gap-2 text-base font-semibold">
              <List className="w-6 h-6 text-white bg-primary rounded-sm p-1" />
              Payment Details
            </div>

            <hr className="my-2 border-gray-300 border-dashed" />

            <div className="flex justify-between text-sm">
              <span>Subtotal ({items.length} menu)</span>
              <span>Rp {sub.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* SHOW ALL */}
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

          {/* COLLAPSIBLE LIST */}
          {showAll && (
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
                      {item?.options ? mappingOption(item.options, item.menuItem.options ?? []) : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.note}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {item.discountAmount > 0 && (
                      <div className="text-xs text-[#E35336] line-through ">
                        {item.subtotal > 0 ? `(${(Number(item.subtotal)).toLocaleString("id-ID")})` : ""}
                      </div>
                    )}
                    <div className="font-semibold">
                      Rp {item.finalPrice.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* VOUCHER */}
        <div className="bg-white rounded-sm p-3 shadow-sm flex flex-col gap-2">
          <div className="flex items-center gap-2 text-base font-semibold">
            <TicketPercent className="w-6 h-6 text-white bg-primary rounded-sm p-1" />
            Voucher
          </div>

          <hr className="my-1 border-gray-300 border-dashed" />

          <div className="flex">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={voucher !== null}
              placeholder="Masukkan Kode Voucher"
              className="flex-1 border rounded-l-lg px-3 py-2 text-sm bg-primary/10"
            />

            {voucher ? (
              <button
                className="bg-primary text-white px-4 rounded-r-lg text-base font-semibold"
                onClick={removeVoucher}
                disabled={loading}
              >
                Batal
              </button>
            ) : (
              <button
                className="bg-primary text-white px-4 rounded-r-lg text-base font-semibold"
                onClick={applyVoucher}
                disabled={loading}
              >
                {loading ? "Loading..." : "Pakai"}
              </button>
            )}
          </div>
        </div>
        
        {/* PAYMENT METHOD */}
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
        
        {/* SUMMARY */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-1 text-sm">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {nSub.toLocaleString("id-ID")}</span>
          </div>

          {transactionData?.data.discount ? (
            <div className="flex justify-between text-[#E35336]">
              <span>Menu Discount</span>
              <span>- Rp {transactionData?.data.discount.toLocaleString("id-ID")}</span>
            </div>
          ) : null}

          {voucher && (
            <div className="flex justify-between text-[#E35336]">
              <span>{voucher.name}</span>
              <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
            </div>
          )}

          {transactionData?.data.tax && (
            <div className="flex justify-between">
              <span>Tax</span>
              <span>Rp {transactionData?.data.tax.toLocaleString("id-ID")}</span>
            </div>
          )}

          {transactionData?.data.serviceCharge && (
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>Rp {transactionData?.data.serviceCharge.toLocaleString("id-ID")}</span>
            </div>
          )}
          
          {transactionData?.data.rounding && (
            <div className="flex justify-between">
              <span>Round</span>
              <span>Rp {transactionData?.data.rounding.toLocaleString("id-ID")}</span>
            </div>
          )}

          <div className="border-t pt-2 flex justify-between font-semibold text-base">
            <span>Total to Pay</span>
            <span>Rp {transactionData?.data.total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* STICKY BUTTON */}
      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white px-4 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
        <button 
          className="w-full bg-[#B87333] text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePayment}
          disabled={isPending || !table }
        >
          {isPending ? "Loading..." : "Payment Rp " + (transactionData?.data.total ? transactionData?.data.total.toLocaleString("id-ID") : "0")}
        </button>
      </div>
      
      <TransactionQrDrawer
        paymentMethod={paymentMethod}
        open={qrOpen}
        setOpen={setQrOpen}
        onClose={() => setQrOpen(false)}
      />
      {isPending && <LoadingScreen />}
    </div>
  )
}