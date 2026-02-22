"use client"

import { useEffect, useMemo, useRef, useState } from "react"
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

type Props = {
  transactionId: string | null
  paymentMethod: string | null
  open: boolean
  setOpen: (open: boolean) => void
  onClose: () => void
}

export function TransactionQrDrawer({
  transactionId,
  paymentMethod,
  open,
  setOpen,
  onClose,
}: Props) {
  const router = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)
  const addCompletedOrder = useOrderStore((s) => s.addCompletedOrder)

  /**
   * 🔥 RESTORE LOCAL STORAGE
   */
  const [restored] = useState(() => {
    if (typeof window === "undefined") return null

    const storedQr = localStorage.getItem("qrGenerated")
    const storedId = localStorage.getItem("transactionId")
    const storedExpire = localStorage.getItem("paymentExpiredAt")

    if (storedQr && storedId && storedExpire) {
      return {
        qrUrl: storedQr,
        transactionId: storedId,
        expiredAt: Number(storedExpire),
      }
    }

    return null
  })

  const activeTransactionId =
    transactionId || restored?.transactionId || null
  console.log(!!activeTransactionId && !restored?.qrUrl)
  /**
   * 🔥 FETCH QR
   */
  const { data: qrData } = useQuery({
    queryKey: ["transaction-qr", activeTransactionId],
    queryFn: () =>
      getTransactionByPaymentNumber(
        activeTransactionId!,
        paymentMethod!
      ),
    enabled: !!activeTransactionId && !restored?.qrUrl,
    refetchOnWindowFocus: false,
  })

  const qrUrl =
    qrData?.data?.actions?.[0]?.url ||
    restored?.qrUrl ||
    null

  /**
   * 🔥 SAVE QR + EXPIRE TIMESTAMP
   */
  const qrSavedRef = useRef(false)

  useEffect(() => {
    if (!qrUrl || qrSavedRef.current) return

    qrSavedRef.current = true

    const FIVE_MINUTES = 5 * 60 * 1000
    const expireTimestamp = Date.now() + FIVE_MINUTES

    localStorage.setItem("qrGenerated", qrUrl)
    localStorage.setItem("transactionId", activeTransactionId!)
    localStorage.setItem("paymentExpiredAt", expireTimestamp.toString())

    toast.success("QR Code generated")

    // aman karena tidak sync render loop
    setTimeout(() => setOpen(true), 0)
  }, [qrUrl, activeTransactionId, setOpen])

  /**
   * 🔥 POLLING STATUS
   */
  const { data: statusData } = useQuery({
    queryKey: ["transaction-status", activeTransactionId],
    queryFn: () => checkTransactionStatus(activeTransactionId!),
    enabled: !!activeTransactionId,
    refetchInterval: (query) => {
      const data = query.state.data
      return data?.data?.status === "pending" ? 5000 : false
    },
    refetchOnWindowFocus: false,
  })

  /**
   * 🔥 HANDLE COMPLETED
   */
  useEffect(() => {
    if (statusData?.data?.status !== "completed") return

    const trx = statusData.data

    addCompletedOrder({
      id: trx.details.id,
      paidAt: Date.now(),
      total: trx.details.total,
      customerName: trx.details.customerName,
    })

    clearCart()

    localStorage.removeItem("transactionId")
    localStorage.removeItem("qrGenerated")
    localStorage.removeItem("paymentExpiredAt")

    toast.success("Payment successful")

    setTimeout(() => {
      router.replace("/")
    }, 3000)
  }, [statusData, addCompletedOrder, clearCart, router])

  /**
   * 🔥 TIMER (PERSISTENT)
   */
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const expiredAt =
    restored?.expiredAt ||
    Number(localStorage.getItem("paymentExpiredAt"))

  const remainingSeconds = useMemo(() => {
    if (!expiredAt) return 0
    return Math.max(
      Math.floor((expiredAt - now) / 1000),
      0
    )
  }, [expiredAt, now])

  /**
   * 🔥 HANDLE EXPIRED
   */
  useEffect(() => {
    if (
      remainingSeconds === 0 &&
      statusData?.data?.status === "pending"
    ) {
      localStorage.removeItem("transactionId")
      localStorage.removeItem("qrGenerated")
      localStorage.removeItem("paymentExpiredAt")

      toast.error("Payment expired")

      setTimeout(() => {
        onClose()
      }, 0)
    }
  }, [remainingSeconds, statusData, onClose])

  if (!activeTransactionId) return null

  const pending = statusData?.data?.status === "pending"
  const expired = statusData?.data?.status === "expired"
  const completed = statusData?.data?.status === "completed"

  return (
    <Drawer open={open} dismissible={false}>
      <DrawerContent className="px-4 pb-6 max-w-lg mx-auto">
        <DrawerHeader>
          <DrawerTitle>Scan QR to Pay</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col items-center gap-4 py-4">

          {qrUrl && (
            <img
              src={qrUrl}
              alt="QR Code"
              width={250}
              height={250}
              className="rounded-lg"
            />
          )}

          {pending && (
            <>
              <p className="text-sm text-muted-foreground">
                Waiting for payment confirmation...
              </p>

              <p className="text-xs text-red-500 font-medium">
                Expires in{" "}
                {Math.floor(remainingSeconds / 60)}:
                {(remainingSeconds % 60)
                  .toString()
                  .padStart(2, "0")}
              </p>
            </>
          )}

          {expired && (
            <p className="text-red-600 font-semibold">
              Payment Expired
            </p>
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