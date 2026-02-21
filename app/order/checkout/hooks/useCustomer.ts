"use client"

import { useState } from "react"

type Customer = {
  name: string
  table: string
}

const STORAGE_KEY = "pos-customer"

export function useCustomer() {
  const [customer, setCustomer] = useState<Customer>(() => {
    if (typeof window === "undefined") {
      return { name: "", table: "" }
    }

    const saved = localStorage.getItem(STORAGE_KEY)
    return saved
      ? JSON.parse(saved)
      : { name: "Guest", table: "-" }
  })

  const saveCustomer = (data: Customer) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setCustomer(data)
  }

  return { customer, saveCustomer }
}