"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, ArrowLeft, ShoppingCart, Trash2, TicketPercent } from "lucide-react"
import { useCartStore } from "@/store/cart.store"
import { EditCartItemDrawer } from "./EditCartItemDrawer"

export default function CartPage() {
  const router = useRouter()

  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalFinal = useCartStore((s) => s.totalFinal)

  return (
    <div className="min-h-screen bg-gray-100 max-w-[600px] mx-auto">

      {/* HEADER */}
      <div 
        className="text-white px-4 py-5 relative"
        style={{
          backgroundImage: "url('/images/header.png')",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-20 z-0"></div>
        <button
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20"
        >
          <ArrowLeft />
        </button>

        <h1 className="text-center font-semibold text-xl text-white z-20">
          Cart
        </h1>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-2"
          >
            <div className="flex gap-4">
              {/* IMAGE */}
              <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={item.img || "/images/all-categories.png"}
                  alt={item.img || "Menu Image"}
                  fill
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex-1">
                <p className="text-sm font-bold">
                  {item.name}
                </p>
                
                {/* OPTIONS */}
                <EditCartItemDrawer item={item} />

                {/* PRICE */}
                <div className="mt-2 text-sm">
                  <div className="flex items-center gap-2">
                    {item.discountAmount > 0 && (
                      <p className="text-sm line-through text-gray-400">
                        Rp {item.subtotal.toLocaleString("id-ID")}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {item.menuItem.promoName && (
                        <div className="bg-[#E35336] text-[10px] px-2 py-0.5 rounded-sm text-white">{item.menuItem.promoName}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="font-semibold">
                      Rp {item.finalPrice.toLocaleString("id-ID")}
                    </p>

                    {item.discountAmount > 0 && (
                      <div className="left-1 bg-green-100/90 text-[10px] px-2 py-1 rounded-sm text-green-900 flex items-center">
                        <TicketPercent size={15}/>
                        {item.menuItem.discType === "nominal" ? (
                          <div className="text-[10px] ml-1">Rp.{item.menuItem.disc?.toLocaleString()}</div>
                        ) : (
                          <div className="text-[10px] ml-1">{item.menuItem.disc}%</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM ACTION */}
            <div className="flex justify-between items-center mt-4 bg-primary/10 rounded-lg pl-2">
              {/* QTY */}
              <div className="flex items-center gap-3 p-1 text-xs">
                <button
                  onClick={() =>{
                    updateQty(item.id, item.qty - 1)
                    if (item.qty <= 1) {
                      removeItem(item.id)
                    }
                  }}
                  className="h-6 w-6 rounded-full bg-primary/20 text-black flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() =>
                    updateQty(item.id, item.qty + 1)
                  }
                  className="h-6 w-6 rounded-full bg-primary/20 text-black flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 text-white px-3 py-3 rounded-lg text-lg"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">Cart is empty</p>
          </div>
        )}
      </div>

      {/* STICKY CHECKOUT */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[600px] mx-auto bg-white px-4 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-[#B87333] text-white py-2 rounded-lg font-semibold"
          >
            Payment · Rp{" "}
            {totalFinal().toLocaleString("id-ID")}
          </button>
        </div>
      )}
    </div>
  )
}
