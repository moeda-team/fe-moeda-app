"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type CustomerState = {
  name: string
  table: string
  hasHydrated: boolean

  setCustomer: (data: { name: string; table: string }) => void
  clearCustomer: () => void
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set) => ({
      name: "CS-Moeda",
      table: "97900414-ca6e-46a8-8361-3336954bfda8",
      hasHydrated: false,

      setCustomer: (data) =>
        set({
          name: data.name,
          table: data.table,
        }),
      clearCustomer: () =>
        set({
          name: "",
          table: "",
        }),
    }),
    {
      name: "pos-customer-storage",
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true
      },
    }
  )
)