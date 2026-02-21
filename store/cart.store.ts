import { Menuitem } from "@/lib/api/menu/req-api"
import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Turunkan type supaya tidak pakai any
 */
type MenuOption = NonNullable<Menuitem["options"]>[number]

export type CartItem = {
  id: string
  menuId: string
  name: string
  qty: number
  note?: string
  img?: string
  options?: Record<string, string[]>
  menuItem: Menuitem

  basePrice: number
  extraPrice: number
  subtotal: number
  discountAmount: number
  finalPrice: number
}

type CartState = {
  items: CartItem[]
  hasHydrated: boolean

  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  updateItem: (id: string, updated: Partial<CartItem>) => void
  updateOption: (
    id: string,
    optionKey: string,
    newValue: string
  ) => void

  clearCart: () => void

  subtotal: () => number
  totalDiscount: () => number
  totalFinal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      hasHydrated: false,

      /**
       * =========================
       * ADD ITEM
       * =========================
       */
      addItem: (newItem) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...newItem, id: crypto.randomUUID() },
          ],
        })),

      /**
       * =========================
       * REMOVE ITEM
       * =========================
       */
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      /**
       * =========================
       * UPDATE QTY
       * =========================
       */
      updateQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item

            const newSubtotal =
              (item.basePrice + item.extraPrice) * qty

            const discountRatio =
              item.subtotal > 0
                ? item.discountAmount / item.subtotal
                : 0

            const newDiscount = newSubtotal * discountRatio

            return {
              ...item,
              qty,
              subtotal: newSubtotal,
              discountAmount: newDiscount,
              finalPrice: Math.max(newSubtotal - newDiscount, 0),
            }
          }),
        })),

      /**
       * =========================
       * FULL UPDATE ITEM
       * =========================
       */
      updateItem: (id, updated) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, ...updated }
              : item
          ),
        })),

      /**
       * =========================
       * UPDATE OPTION (RECALCULATE SAFE)
       * =========================
       */
      updateOption: (id, optionKey, newValue) =>
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id !== id) return item

            const updatedOptions: Record<string, string[]> = {
              ...item.options,
              [optionKey]: [newValue],
            }

            /**
             * 1️⃣ CLEANUP CHILD OPTION
             */
            const cleanupRecursive = (
              options: MenuOption[]
            ) => {
              options.forEach((opt) => {
                const selectedVal =
                  updatedOptions[opt.id]?.[0]
                if (!selectedVal) return

                const selectedChoice =
                  opt.choices.find(
                    (c) => c.value === selectedVal
                  )

                opt.choices.forEach((choice) => {
                  if (choice.value !== selectedVal) {
                    choice.subOptions?.forEach(
                      (sub) => {
                        delete updatedOptions[sub.id]
                      }
                    )
                  }
                })

                if (
                  selectedChoice?.subOptions?.length
                ) {
                  cleanupRecursive(
                    selectedChoice.subOptions
                  )
                }
              })
            }

            if (item.menuItem.options) {
              cleanupRecursive(item.menuItem.options)
            }

            /**
             * 2️⃣ RECALCULATE EXTRA PRICE
             */
            let newExtra = 0

            const calculateRecursive = (
              options: MenuOption[]
            ) => {
              options.forEach((opt) => {
                const selectedVal =
                  updatedOptions[opt.id]?.[0]
                if (!selectedVal) return

                const selectedChoice =
                  opt.choices.find(
                    (c) => c.value === selectedVal
                  )

                if (!selectedChoice) return

                newExtra +=
                  selectedChoice.extraPrice ?? 0

                if (
                  selectedChoice.subOptions?.length
                ) {
                  calculateRecursive(
                    selectedChoice.subOptions
                  )
                }
              })
            }

            if (item.menuItem.options) {
              calculateRecursive(
                item.menuItem.options
              )
            }

            /**
             * 3️⃣ RECALCULATE PRICING
             */
            const basePrice = Number(
              item.menuItem.price
            )

            const newSubtotal =
              (basePrice + newExtra) * item.qty

            let newDiscount = 0
            const voucher =
              item.menuItem.vouchers?.[0]?.voucher

            if (voucher?.type === "percent") {
              newDiscount =
                newSubtotal *
                (Number(voucher.discount) / 100)
            }

            if (voucher?.type === "fixed") {
              newDiscount = Number(voucher.discount)
            }

            const newFinal = Math.max(
              newSubtotal - newDiscount,
              0
            )

            return {
              ...item,
              options: updatedOptions,
              extraPrice: newExtra,
              subtotal: newSubtotal,
              discountAmount: newDiscount,
              finalPrice: newFinal,
            }
          }),
        })),

      /**
       * =========================
       * CLEAR
       * =========================
       */
      clearCart: () => set({ items: [] }),

      /**
       * =========================
       * TOTALS
       * =========================
       */
      subtotal: () =>
        get().items.reduce(
          (total, item) => total + item.subtotal,
          0
        ),

      totalDiscount: () =>
        get().items.reduce(
          (total, item) => total + item.discountAmount,
          0
        ),

      totalFinal: () =>
        get().items.reduce(
          (total, item) => total + item.finalPrice,
          0
        ),
    }),
    {
      name: "pos-cart-storage",

      /**
       * 🔥 HYDRATION FIX
       */
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true
        }
      },
    }
  )
)