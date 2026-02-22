"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Minus, Plus, ShoppingCart, Trash2, TicketPercent } from "lucide-react"
import { useCartStore } from "@/store/cart.store"
import { HeaderWithBackground } from "@/components/public/component/HeaderWithBackground"
import { EditCartItemDrawer } from "./EditCartItemDrawer"

export default function CartPage() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)
  const totalFinal = useCartStore((s) => s.totalFinal)

  return (
    <div className="min-h-screen bg-gray-100 max-w-lg mx-auto">

      {/* HEADER */}
      <HeaderWithBackground title="Cart" />

      {/* CONTENT */}
      <div className="px-4 py-4 space-y-4 pb-20">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-sm p-2 relative"
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
              <div className="flex flex-col justify-between">
                <div className="flex flex-col">
                  <div className="text-lg font-bold">
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item?.options
                      ? Object.values(item.options).flat().join(", ")
                      : ""}
                  </div>
                </div>

                <div className="flex flex-col">
                  {/* NOTE */}
                  <div className="text-xs text-muted-foreground">
                    {item.note}
                  </div>

                  {/* PRICE */}
                  <div className="text-sm">
                    <div className="flex items-center gap-2">
                      {item.discountAmount > 0 && (
                        <p className="text-sm line-through text-[#E35336]">
                          Rp {item.subtotal.toLocaleString("id-ID")}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        {item.menuItem.vouchers.length > 0 && (
                          <div className="bg-[#E35336] text-[10px] px-2 py-0.5 rounded-sm text-white">{item.menuItem.vouchers[0].voucher.name}</div>
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
                          {item.menuItem.vouchers[0].voucher.type === "fixed" ? (
                            <div className="text-[10px] ml-1">Rp.{item.menuItem.vouchers[0].voucher.discount.toLocaleString()}</div>
                          ) : (
                            <div className="text-[10px] ml-1">{item.menuItem.vouchers[0].voucher.discount}%</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* edit */}
              {/* <Button onClick={() => router.push(`/menu/${item.id}`)} className="absolute top-2 right-2 rounded-full bg-[#F3A93B] text-white" size="icon"><Edit2 /></Button> */}
              <EditCartItemDrawer item={item} />
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
                  className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>

                <span>{item.qty}</span>

                <button
                  onClick={() =>
                    updateQty(item.id, item.qty + 1)
                  }
                  className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item.id)}
                className="bg-[#E35336] text-white px-3 py-3 rounded-lg text-lg"
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
        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white px-4 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => router.push("/order/checkout")}
            className="w-full bg-[#B87333] text-white py-2 rounded-lg font-semibold"
          >
            Checkout · Rp{" "}
            {totalFinal().toLocaleString("id-ID")}
          </button>
        </div>
      )}
    </div>
  )
}
