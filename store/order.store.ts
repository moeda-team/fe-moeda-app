"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CompletedOrder = {
  id: string
  paidAt: number
  total: number
  customerName: string
}

type OrderState = {
  completedOrders: Record<string, CompletedOrder>

  addCompletedOrder: (order: CompletedOrder) => void
  removeCompletedOrder: (id: string) => void
  clearCompletedOrders: () => void

  getCompletedOrder: (id: string) => CompletedOrder | undefined
  getAllCompleted: () => CompletedOrder[]
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      completedOrders: {},

      addCompletedOrder: (order) =>
        set((state) => ({
          completedOrders: {
            ...state.completedOrders,
            [order.id]: order,
          },
        })),

      removeCompletedOrder: (id) =>
        set((state) => {
          const updated = { ...state.completedOrders }
          delete updated[id]
          return { completedOrders: updated }
        }),

      clearCompletedOrders: () =>
        set({ completedOrders: {} }),

      getCompletedOrder: (id) =>
        get().completedOrders[id],

      getAllCompleted: () =>
        Object.values(get().completedOrders),
    }),
    {
      name: "completed-orders-storage",
    }
  )
)