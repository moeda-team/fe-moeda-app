"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

  export type CompletedOrder = {
    id: string
    paidAt: number
    total: number
    customerName: string
    details: CompletedOrderDetails
  }
  
  export type CompletedOrderDetails = {
    id: string,
    userId: string,
    outletId: string,
    number: string,
    transactionType: string,
    table : {
      id : string,
      name : string
    },
    paymentNumber : string,
    paymentMethod : string,
    customerName : string,
    totalSubTransaction : number,
    subTotal : string,
    discount : string,
    serviceCharge : string,
    rounding : string,
    total : string,
    additionalNote : string,
    voucherId : null,
    status : string,
    fraudStatus : string,
    createdAt : string,
    updatedAt : string,
    subTransactions : CompletedOrderSubTransaction[]
  }

  export type CompletedOrderSubTransaction = {
    id : string,
    transactionId : string,
    menuId : string,
    menuName : string,
    quantity : number,
    price : string,
    subTotal : string,
    addOn : string,
    note : string,
    status : string,
    createdAt : string,
    updatedAt : string
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