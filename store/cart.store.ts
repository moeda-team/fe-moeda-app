import { Menuitem } from "@/lib/api/customer/req-api"
import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * Kita turunkan type dari Menuitem supaya tidak pakai any
 */
type MenuOption = NonNullable<Menuitem["options"]>[number]
type MenuChoice = MenuOption["choices"][number]

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
  addItem: (item: Omit<CartItem, "id">) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  subtotal: () => number
  totalDiscount: () => number
  totalFinal: () => number
  updateOption: (
    id: string,
    optionKey: string,
    newValue: string
  ) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (newItem) =>
        set((state) => ({
          items: [
            ...state.items,
            { ...newItem, id: crypto.randomUUID() },
          ],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

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

      clearCart: () => set({ items: [] }),

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

      /**
       * =====================================================
       * 🔥 TYPE-SAFE updateOption (NO ANY)
       * =====================================================
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
             * 1️⃣ CLEANUP CHILD OPTION (TYPE SAFE)
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

                // hapus subOptions dari choice lain
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
                  selectedChoice?.subOptions &&
                  selectedChoice.subOptions.length
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
             * 2️⃣ RECALCULATE EXTRA PRICE (TYPE SAFE)
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
                  selectedChoice.subOptions &&
                  selectedChoice.subOptions.length
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

            if (
              item.menuItem.discType ===
              "persentase"
            ) {
              newDiscount =
                newSubtotal *
                (Number(item.menuItem.disc) / 100)
            }

            if (
              item.menuItem.discType === "nominal"
            ) {
              newDiscount = Number(
                item.menuItem.disc
              )
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
    }),
    {
      name: "pos-cart-storage",
    }
  )
)
