"use client"

import * as React from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Minus, Plus, Edit2 } from "lucide-react"
import { OptionRenderer } from "@/components/public/component/drawer/OptionRender"
import { useCartStore, CartItem } from "@/store/cart.store"
import Image from "next/image"
import { MenuOption } from "@/lib/api/customer/req-api"

type Props = {
  item: CartItem
}

export function EditCartItemDrawer({ item }: Props) {
  const updateItem = useCartStore((s) => s.updateItem)

  const [open, setOpen] = React.useState(false)

  const [qty, setQty] = React.useState(item.qty)
  const [note, setNote] = React.useState(item.note || "")
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string[]>
  >(item.options || {})

  /**
   * =========================
   * HANDLE SELECT
   * =========================
   */
  const handleSelect = (
    optionId: string,
    value: string,
    type: "single" | "multiple"
  ) => {
    setSelectedOptions((prev) => {
      const newState = { ...prev }

      if (type === "single") {
        newState[optionId] = [value]
      } else {
        const current = newState[optionId] ?? []

        if (current.includes(value)) {
          newState[optionId] = current.filter((v) => v !== value)
        } else {
          newState[optionId] = [...current, value]
        }
      }

      /**
       * 🔥 CLEANUP CHILD OPTIONS
       */
      const cleanupChildren = (options: MenuOption[]) => {
        options.forEach((opt) => {
          const selectedVal = newState[opt.id]?.[0]
          if (!selectedVal) return

          const selectedChoice = opt.choices.find(
            (c) => c.value === selectedVal
          )

          opt.choices.forEach((choice) => {
            if (choice.value !== selectedVal) {
              choice.subOptions?.forEach((sub) => {
                delete newState[sub.id]
              })
            }
          })

          if (selectedChoice?.subOptions?.length) {
            cleanupChildren(selectedChoice.subOptions)
          }
        })
      }

      if (item.menuItem.options) {
        cleanupChildren(item.menuItem.options)
      }

      return newState
    })
  }

  /**
   * =========================
   * RECALCULATE PRICE
   * =========================
   */
  const extraPrice = React.useMemo(() => {
    let total = 0

    const walk = (options: typeof item.menuItem.options) => {
      options?.forEach((option) => {
        const selectedValue = selectedOptions[option.id]?.[0]
        if (!selectedValue) return

        const selectedChoice = option.choices.find(
          (c) => c.value === selectedValue
        )

        if (!selectedChoice) return

        total += selectedChoice.extraPrice ?? 0

        if (selectedChoice.subOptions?.length) {
          walk(selectedChoice.subOptions)
        }
      })
    }

    walk(item.menuItem.options)

    return total
  }, [item.menuItem.options, selectedOptions])

  const basePrice = Number(item.menuItem.price) + extraPrice
  const subtotal = basePrice * qty
  const totalPrice = subtotal // kalau mau voucher tinggal tambahin logic sama kayak AddMenuDrawer

  /**
   * =========================
   * SAVE
   * =========================
   */
  const handleSave = () => {
    updateItem(item.id, {
      qty,
      note,
      options: selectedOptions,
      extraPrice,
      subtotal,
      finalPrice: totalPrice,
    })

    setOpen(false)
  }

  const originalPrice = Number(item.menuItem.price)
  const hasDiscount = item.menuItem.discountMenus.length > 0 && Number(item.menuItem.discountMenus[0].discount.discount) > 0

  const discountedPrice = hasDiscount ?
    item.menuItem.discountMenus[0].discount.type === "percent"
      ? originalPrice - (originalPrice * Number(item.menuItem.discountMenus[0].discount.discount)) / 100
      : originalPrice - Number(item.menuItem.discountMenus[0].discount.discount)
    : originalPrice

  return (
    <>
      
      <Button onClick={() => setOpen(true)} className="absolute top-2 right-2 rounded-full bg-[#F3A93B] text-white" size="icon"><Edit2 /></Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4 pb-6 max-w-lg mx-auto">
          <DrawerHeader>
            <DrawerTitle className="text-lg font-semibold text-primary">
              Edit {item.name}
            </DrawerTitle>
          </DrawerHeader>

          <div className="max-h-[60vh] overflow-y-auto space-y-4">
            <div className="flex gap-4 py-2 mb-2">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                <Image
                  src={item.menuItem.img}
                  alt={item.menuItem.name}
                  fill
                  className="object-cover"
                />
              </div>
  
              <div className="flex-1">
                <p className="text-sm font-medium line-clamp-1">
                  {item.menuItem.name}
                </p>
  
                <div className="flex items-end gap-2 mt-1">
                  <p
                    className={
                      hasDiscount
                        ? "text-xs font-semibold line-through text-[#E35336]"
                        : "text-xl font-semibold"
                    }
                  >
                    Rp {originalPrice.toLocaleString("id-ID")}
                  </p>
  
                  {hasDiscount && (
                    <p className="font-semibold text-xl">
                      Rp{" "}
                      {Math.max(discountedPrice, 0).toLocaleString("id-ID")}
                    </p>
                  )}
                </div>
  
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                  {item.menuItem.desc}
                </p>
              </div>
            </div>

            {/* OPTIONS */}
            {item.menuItem.options?.map((option) => (
              <OptionRenderer
                key={option.id}
                option={option}
                selectedOptions={selectedOptions}
                handleSelect={handleSelect}
              />
            ))}

            {/* NOTE */}
            <div>
              <p className="text-xs font-medium mb-2">Note</p>
              <Textarea
                className="bg-primary/10"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* QTY */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  <Minus size={16} />
                </Button>

                <span>{qty}</span>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => setQty((q) => q + 1)}
                >
                  <Plus size={16} />
                </Button>
              </div>

              <p className="font-semibold">
                Rp {totalPrice.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <DrawerFooter>
            <Button
              className="w-full"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}