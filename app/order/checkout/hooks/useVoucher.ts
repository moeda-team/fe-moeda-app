"use client"

import { axiosClient } from "@/lib/api/axios-client"
import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"

type VoucherType = "percent" | "fixed"

type VoucherResponse = {
  name: string
  type: VoucherType
  discount: number
}

export function useVoucher(subtotal: number) {
  const [code, setCode] = useState("")
  const [voucher, setVoucher] = useState<VoucherResponse | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * =========================
   * APPLY VOUCHER (API CALL)
   * =========================
   */
  
    const applyVoucher = async () => {
      if (!code) {
        toast.error("Kode voucher tidak boleh kosong")
        return
      }

      try {
        setLoading(true)

        const res = await axiosClient.get(`/vouchers/${code}/detail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = await res.data

        if (!data) {
          toast.error("Voucher tidak valid")
          return
        }
        
        if(data.data.expiredAt < new Date().toISOString()) {
          toast.error("Voucher sudah kadaluarsa")
          return
        }

        setVoucher(data.data)
        toast.success("Voucher berhasil digunakan")

      } catch (err) {
        toast.error("Terjadi kesalahan saat validasi voucher")
      } finally {
        setLoading(false)
      }
    }


  /**
   * =========================
   * REMOVE VOUCHER (FIXED)
   * =========================
   */
  const removeVoucher = () => {
    setVoucher(null)
    setCode("")
    toast.success("Voucher dibatalkan")
  }

  /**
   * =========================
   * AUTO REMOVE IF SUBTOTAL CHANGED
   * (optional but recommended)
   * =========================
   */
  useEffect(() => {
    if (voucher && subtotal <= 0) {
      setVoucher(null)
      setCode("")
    }
  }, [subtotal])

  /**
   * =========================
   * CALCULATE DISCOUNT
   * =========================
   */
  const discountAmount = useMemo(() => {
    if (!voucher) return 0

    if (voucher.type === "percent") {
      return subtotal * (voucher.discount / 100)
    }

    if (voucher.type === "fixed") {
      return voucher.discount
    }

    return 0
  }, [voucher, subtotal])

  return {
    code,
    setCode,
    voucher,
    loading,
    applyVoucher,
    removeVoucher,
    discountAmount,
  }
}