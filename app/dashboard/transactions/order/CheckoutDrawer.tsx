"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useCartStore } from "@/store/cart.store"
import { useCustomerStore } from "@/store/customer.store"
import { ChevronDown, List, TicketPercent } from "lucide-react"
import {
  getTransactionByPaymentNumber,
  getTransactionCalculate,
} from "@/lib/api/customer/req-api"
import { toast } from "sonner"
import axios from "axios"
import { useQuery } from "@tanstack/react-query"
import { useTablesQuery } from "@/app/dashboard/master-data/tables/hooks/use"
import { mappingOption } from "@/lib/option-utils"
import { useCreateTransaction } from "@/app/order/checkout/hooks/useTransactions"
import { useVoucher } from "@/app/order/checkout/hooks/useVoucher"
import { EditCustomerDrawer } from "@/app/order/checkout/EditCustomerDrawer"
import { Button } from "@/components/ui/button"
import { checkTransactionStatus } from "@/lib/api/customer/req-api"
import { PaymentMethodSelector } from "./PaymentMethodSelector"

type Props = {
  open: boolean
  onOpenChange: (val: boolean) => void
  onSuccess?: (data: string) => void
}

export function CheckoutDrawer({ open, onOpenChange, onSuccess }: Props) {
  /**
   * =========================
   * STORE
   * =========================
   */
  const items = useCartStore((s) => s.items)
  const subtotalFn = useCartStore((s) => s.totalFinal)
  const nSubtotal = useCartStore((s) => s.subtotal)
  const totalDiscountFn = useCartStore((s) => s.totalDiscount)

  const name = useCustomerStore((s) => s.name)
  const table = useCustomerStore((s) => s.table)
  const hasHydrated = useCustomerStore((s) => s.hasHydrated)

  /**
   * =========================
   * LOCAL STATE
   * =========================
   */
  const [paymentMethod, setPaymentMethod] = useState("qris")
  const [qr, setQr] = useState("")
  const [expiredAt, setExpiredAt] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const sub = subtotalFn()
  const nSub = nSubtotal()
  const cartDiscount = totalDiscountFn()
  const clearCart = useCartStore((s) => s.clearCart)
  const clearCustoemr = useCustomerStore((s) => s.clearCustomer)

  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(null)

  const { mutate, isPending } = useCreateTransaction()

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
        paymentMethod,
        nSub,
        Number(discountAmount),
        cartDiscount
      ),
    enabled: !!paymentMethod && open,
  })
  
  /**
   * 🔥 POLLING STATUS
   */
  const { data: statusData } = useQuery({
    queryKey: ["transaction-status", activeTransactionId],
    queryFn: () =>
      checkTransactionStatus(activeTransactionId!),
    enabled: !!activeTransactionId && !!qr && open,
    refetchInterval: (query) => {
      const data = query.state.data
      return data?.data?.status === "pending"
        ? 7000
        : false
    },
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (statusData?.data?.status !== "completed") return

    toast.success("Payment successful")

    onOpenChange(false)
    setTimeout(() => {
      setQr("")
      clearCart()
      clearCustoemr()
      setExpiredAt(null)
      setActiveTransactionId(null)
      onSuccess?.(statusData?.data.details.id)
    }, 500)
    
  }, [statusData, onOpenChange, onSuccess])

  const { data: TABLE_OPTIONS } = useTablesQuery({
    search: "",
  })

  /**
   * =========================
   * COUNTDOWN EFFECT
   * =========================
   */
  useEffect(() => {
    if (!expiredAt) return

    const interval = setInterval(() => {
      const remaining = expiredAt - Date.now()

      if (remaining <= 0) {
        clearInterval(interval)
        setTimeLeft(0)
        setQr("")
        setExpiredAt(null)
        return
      }

      setTimeLeft(Math.floor(remaining / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [expiredAt])

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }, [timeLeft])

  if (!hasHydrated) return null

  /**
   * =========================
   * PAYMENT
   * =========================
   */
  const handlePayment = () => {
    mutate(
      {
        outletId: process.env.NEXT_PUBLIC_OUTLET_ID ?? "",
        transactionType: "dine-in",
        tableId: table,
        paymentMethod,
        customerName: name,
        discount: transactionData?.data.discount ?? 0,
        additionalNote: "",
        voucher: code,
        cart:
          items.map((item) => ({
            menuId: item.menuId,
            menuName: item.name,
            quantity: item.qty,
            discount : item.discountAmount,
            price : item.basePrice,
            subTotal : item.subtotal + Number(item.discountAmount),
            addOn : item?.options ? Object.values(item.options).flat().join(", ") : "",
            addOnPrice : item.extraPrice,
            note: item.note ?? "",
          })) ?? [],
      },
      {
        onSuccess: async (data) => {
          if(transactionData?.data.total === 0 || paymentMethod === 'cash' || paymentMethod === 'debit'){
            onSuccess?.(data.data.id)
          }else{
            const paymentNumber = data.data.paymentNumber

            const transaction = await getTransactionByPaymentNumber(
              paymentNumber,
              paymentMethod
            )

            const qrUrl = transaction.data.actions?.[0]?.url || ""

            setQr(qrUrl)
            setActiveTransactionId(paymentNumber)

            const FIVE_MINUTES = 5 * 60 * 1000
            setExpiredAt(Date.now() + FIVE_MINUTES)
          }
        },
        onError: (error) => {
          if (axios.isAxiosError(error)) {
            toast.error(error?.response?.data?.message)
          }
        },
      }
    )
  }

  const getInitials = (name?: string) => {
    if (!name) return "N/A"
    const parts = name.trim().split(/\s+/)
    return parts.length === 1
      ? parts[0].slice(0, 2).toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-[500px] mx-auto flex flex-col">

        <DrawerHeader>
          <DrawerTitle>Checkout Detail</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          {/* CUSTOMER INFO */}
          <div className=" rounded-sm p-3 shadow-sm border relative">
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
        
          {/* PAYMENT DETAILS */}
          <div className=" rounded-sm p-3 shadow-sm border flex flex-col gap-2">
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
                          {item.subtotal > 0 ? `(${item.subtotal.toLocaleString("id-ID")})` : ""}
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
          <div className=" rounded-sm p-3 shadow-sm border flex flex-col gap-2">
            <div className="flex items-center gap-2 text-base font-semibold">
              <TicketPercent className="w-6 h-6 text-white bg-primary rounded-sm p-1" />
              Voucher
            </div>

            <hr className="my-1 border-gray-300 border-dashed" />

            <div className="flex">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
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

          {/* QR OR PAYMENT METHOD */}
          {qr ? (
            <div className="flex flex-col items-center space-y-3 border rounded p-4">
              <img src={qr} alt="QR Code" width={250} height={250} />

              <div className="text-red-500 font-semibold">
                Expired in {formattedTime}
              </div>

              <div onClick={() => navigator.clipboard.writeText(qr!)} className="cursor-pointer font-bold underline text-sm">
                Copy Payment Number
              </div>
          
            </div>
          ) : (
            <PaymentMethodSelector
              value={paymentMethod}
              onChange={setPaymentMethod}
            />
          )}
          
          {/* SUMMARY */}
          <div className=" rounded-xl p-4 shadow-sm border space-y-1 text-sm">

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

            {voucher ? (
              <div className="flex justify-between text-[#E35336]">
                <span>{voucher.name}</span>
                <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
              </div>
            ) : null}
            

            {transactionData?.data.tax ? (
              <div className="flex justify-between">
                <span>Tax</span>
                <span>Rp {transactionData?.data.tax.toLocaleString("id-ID")}</span>
              </div>
            ) : null}
            

            {transactionData?.data.serviceCharge ? (
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>Rp {transactionData?.data.serviceCharge.toLocaleString("id-ID")}</span>
              </div>
            ) : null}
            
            
            {transactionData?.data.rounding ? (
              <div className="flex justify-between">
                <span>Round</span>
                <span>Rp {transactionData?.data.rounding.toLocaleString("id-ID")}</span>
              </div>
            ) : null}
            

            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>Total to Pay</span>
              <span>Rp {transactionData?.data.total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
          <div className="flex gap-2 p-4 border-t  ">
            {transactionData?.data.total !== 0 ?
              <Button
                className="w-9/12"
                onClick={handlePayment}
                disabled={isPending || !table || !!qr}
              >
                {isPending
                  ? "Loading..."
                  : "Payment Rp " +
                    (transactionData?.data.total
                      ? transactionData.data.total.toLocaleString("id-ID")
                      : "0")}
              </Button>
            :
              <Button
                className="w-9/12"
                onClick={handlePayment}
                disabled={!table}
              >
                Free
              </Button>
            }
            <Button className="w-3/12" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          </div>
      </DrawerContent>
    </Drawer>
  )
}