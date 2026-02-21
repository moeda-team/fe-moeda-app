"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useQuery } from "@tanstack/react-query"
import { useCartStore } from "@/store/cart.store"
import { useRouter } from "next/navigation"
import {
  getTransactionByPaymentNumber,
  checkTransactionStatus,
} from "@/lib/api/customer/req-api"
import { toast } from "sonner"
import { useOrderStore } from "@/store/order.store"
import Image from "next/image"

type Props = {
  transactionId: string | null
  paymentMethod: string | null
  open: boolean
  onClose: () => void
  removeVoucher?: () => void
}

export function TransactionQrDrawer({
  transactionId,
  paymentMethod,
  open,
  onClose,
}: Props) {
  const router = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)

  /**
   * =========================
   * FETCH QR (ONCE)
   * =========================
   */
  const { data: qrData } = useQuery({
    queryKey: ["transaction-qr", transactionId],
    queryFn: () =>
      getTransactionByPaymentNumber(
        transactionId!,
        paymentMethod!
      ),
    enabled: !!transactionId,
    refetchOnWindowFocus: false,
  })

  /**
   * =========================
   * POLLING STATUS (BACKEND AUTHORITY)
   * =========================
   */
  const {
    data: statusData,
  } = useQuery({
    queryKey: ["transaction-status", transactionId],
    queryFn: () => checkTransactionStatus(transactionId!),
    enabled: !!transactionId,
    refetchInterval: (query) => {
      const data = query.state.data
      return data?.data?.status === "pending" ? 5000 : false
    },
    refetchOnWindowFocus: false,
  })

  /**
   * =========================
   * HANDLE STATUS CHANGES
   * =========================
   */
  const addCompletedOrder = useOrderStore(
    (s) => s.addCompletedOrder
  )

  useEffect(() => {
    if (statusData?.data.status === "completed") {
      const trx = statusData.data
      
      // simpan ke completed
      addCompletedOrder({
        id: trx.details.id,
        paidAt: Date.now(),
        total: trx.details.total,
        customerName: trx.details.customerName,
      })

      clearCart()
      toast.success("Payment successful")
      setTimeout(() => {
        router.replace(`/`)
      }, 3000);
    }
  }, [statusData, addCompletedOrder, clearCart, router])

  /**
   * =========================
   * UI TIMER (ONLY FOR DISPLAY)
   * =========================
   */
  const expired = statusData?.data?.status === "expired"
  const completed = statusData?.data?.status === "completed"
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const remainingSeconds = useMemo(() => {
    if (!statusData?.data?.expiredAt) return null

    const expireTime = new Date(
      statusData.data.expiredAt
    ).getTime()

    const diff = expireTime - now

    return Math.max(Math.floor(diff / 1000), 0)
  }, [statusData, now])

  if (!transactionId) return null

  return (
    <Drawer
      open={open}
      onOpenChange={() => {
        if (expired) onClose()
      }}
    >
      <DrawerContent className="px-4 pb-6 max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>Scan QR to Pay</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center gap-4 py-4">

          {qrData?.data.actions?.[0]?.url && (
            <Image src={qrData.data.actions[0].url} alt="QR Code" width={250} height={250} className="rounded-lg" />
          )}

          {statusData?.data.status === "pending" && (
            <p className="text-sm text-muted-foreground">
              Waiting for payment confirmation...
            </p>
          )}

          {remainingSeconds !== null &&
            statusData?.data.status === "pending" && (
              <p className="text-xs text-red-500 font-medium">
                Expires in{" "}
                {Math.floor(remainingSeconds / 60)}:
                {(remainingSeconds % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
            )}

          {expired && (
            <div className="text-center">
              <p className="text-red-600 font-semibold">
                Payment Expired
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-primary underline text-sm"
              >
                Close
              </button>
            </div>
          )}

          {completed && (
            <p className="text-green-600 font-semibold">
              Payment Successful
            </p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}