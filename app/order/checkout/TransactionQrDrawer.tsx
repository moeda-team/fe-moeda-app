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
   * =========================
   * STATE (DECLARE FIRST)
   * =========================
   */

  const [expiredAt, setExpiredAt] = useState<number | null>(() => {
    if (typeof window === "undefined") return null
    const stored = localStorage.getItem("paymentExpiredAt")
    return stored ? Number(stored) : null
  })

  const [now, setNow] = useState(() => Date.now())

  const qrSavedRef = useRef(false)
  const expiredHandledRef = useRef(false)

  const activeTransactionId = transactionId

  /**
   * =========================
   * FETCH QR
   * =========================
   */

  const { data: qrData } = useQuery({
    queryKey: ["transaction-qr", activeTransactionId],
    queryFn: () =>
      getTransactionByPaymentNumber(
        activeTransactionId!,
        paymentMethod!
      ),
    enabled: !!activeTransactionId,
    refetchOnWindowFocus: false,
  })

  const qrUrl =
    qrData?.data?.actions?.[0]?.url ?? null

  /**
   * =========================
   * START TIMER WHEN QR READY
   * =========================
   */

  useEffect(() => {
    if (!qrUrl || qrSavedRef.current) return

    qrSavedRef.current = true

    const FIVE_MINUTES = 30 * 1000 // 30 detik untuk test
    const expireTimestamp = Date.now() + FIVE_MINUTES

    localStorage.setItem("qrGenerated", qrUrl)
    localStorage.setItem("transactionId", activeTransactionId!)
    localStorage.setItem("paymentExpiredAt", expireTimestamp.toString())

    setExpiredAt(expireTimestamp)
    expiredHandledRef.current = false

    toast.success("QR Code generated")
    setOpen(true)
  }, [qrUrl, activeTransactionId, setOpen])

  /**
   * =========================
   * TIMER INTERVAL
   * =========================
   */

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const remainingSeconds = useMemo(() => {
    if (!expiredAt) return null

    return Math.max(
      Math.floor((expiredAt - now) / 1000),
      0
    )
  }, [expiredAt, now])

  /**
   * =========================
   * POLLING STATUS
   * =========================
   */

  const { data: statusData } = useQuery({
    queryKey: ["transaction-status", activeTransactionId],
    queryFn: () => checkTransactionStatus(activeTransactionId!),
    enabled: !!activeTransactionId,
    refetchInterval: (query) =>
      query.state.data?.data?.status === "pending"
        ? 5000
        : false,
  })

  /**
   * =========================
   * HANDLE COMPLETED
   * =========================
   */

  useEffect(() => {
    if (statusData?.data?.status !== "completed")
      return

    const trx = statusData.data

    addCompletedOrder({
      id: trx.details.id,
      paidAt: Date.now(),
      total: Number(trx.details.total),
      customerName: trx.details.customerName,
      details: trx.details,
    })

    clearCart()

    localStorage.removeItem("transactionId")
    localStorage.removeItem("qrGenerated")
    localStorage.removeItem("paymentExpiredAt")

    setExpiredAt(null)

    toast.success("Payment successful")

    router.replace(`/order/checkout/${trx.details.id}`)
  }, [statusData, addCompletedOrder, clearCart, router])

  /**
   * =========================
   * HANDLE EXPIRED
   * =========================
   */

  useEffect(() => {
    if (
      expiredHandledRef.current ||
      !expiredAt ||
      remainingSeconds !== 0 ||
      statusData?.data?.status !== "pending"
    ) {
      return
    }

    expiredHandledRef.current = true

    localStorage.removeItem("transactionId")
    localStorage.removeItem("qrGenerated")
    localStorage.removeItem("paymentExpiredAt")

    setExpiredAt(null)

    toast.error("Payment expired")

    onClose()
  }, [remainingSeconds, statusData, expiredAt, onClose])

  if (!activeTransactionId) return null

  const pending =
    statusData?.data?.status === "pending"

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

          {pending &&
            remainingSeconds !== null && (
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}