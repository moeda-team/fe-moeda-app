"use client"

import { useCartStore } from "@/store/cart.store"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"

export function StickyBottomCart() {
  const router = useRouter()

  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const totalFinal = useCartStore((s) => s.totalFinal())
  const totalDiscount = useCartStore((s) => s.totalDiscount())

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0)

  if (!items.length) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-lg mx-auto">
        <div
          className="
            bg-white
            shadow-[0_-8px_30px_rgba(0,0,0,0.08)]
            px-4
            pt-4
            pb-[calc(1rem+env(safe-area-inset-bottom))]
            flex
            items-center
            justify-between
          "
        >
          {/* LEFT - CART ICON */}
          <div className="relative">
            <div 
              className="
                bg-primary 
                rounded-xl 
                p-2
                cursor-pointer
                hover:bg-primary/90
                transition
                active:scale-95
              "
              onClick={() => router.push("/cart")}
            >
              <ShoppingCart className="text-white" size={20} />
            </div>

            <span className="
              absolute -top-2 -right-2
              bg-red-500 text-white
              text-xs font-bold
              rounded-full px-2 py-0.5
            ">
              {totalItems}
            </span>
          </div>

          <div className="flex gap-4">
            {/* CENTER - PRICE */}
            <div className="text-center">
              {totalDiscount > 0 && (
                <p className="text-xs line-through text-gray-400">
                  Rp {subtotal.toLocaleString("id-ID")}
                </p>
              )}

              <p className="text-lg font-semibold">
                Rp {totalFinal.toLocaleString("id-ID")}
              </p>
            </div>

            {/* RIGHT - PAYMENT BUTTON */}
            <button
              onClick={() => router.push("/checkout")}
              className="
                bg-[#B87333]
                hover:bg-[#a5662d]
                text-white
                px-6
                py-2
                rounded-lg
                font-semibold
                transition
                active:scale-95
              "
            >
              Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
