"use client"

import * as React from "react"
import Image from "next/image"
import { Minus, Plus, ShoppingCart, X } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useCartStore } from "@/store/cart.store"
import { Menuitem } from "@/lib/api/menu/req-api"
import { MenuOption } from "@/lib/api/customer/req-api"
import { OptionRenderer } from "../drawer/OptionRender"

type Props = {
  menu: Menuitem,
  order : number
}

export function AddMenuDrawer({ menu, order }: Props) {
  if (menu.options?.length > 0) {
    menu.options.forEach((option) => {
      menu = {
        ...menu,
        options: option.data || []
      }
    })
  }
  
  const [open, setOpen] = React.useState(false)
  const [qty, setQty] = React.useState<number>(1)
  const [note, setNote] = React.useState<string>("")
  const [selectedOptions, setSelectedOptions] = React.useState<
    Record<string, string[]>
  >({})

  const addItem = useCartStore((state) => state.addItem)

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

      if (menu.options) {
        cleanupChildren(menu.options)
      }

      return newState
    })
  }

  /**
   * =========================
   * EXTRA PRICE (recursive safe)
   * =========================
   */
  const extraPrice = React.useMemo(() => {
    if (!menu.options?.length) return 0

    let total = 0

    const walk = (options: typeof menu.options) => {
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

    walk(menu.options)

    return total
  }, [menu.options, selectedOptions])

  /**
   * =========================
   * PRICING ENGINE
   * =========================
   */

  const basePrice = Number(menu.price) + extraPrice
  const subtotal = basePrice * qty

  const discountAmount = React.useMemo(() => {
    if (!menu.discountMenus.length || Number(menu.discountMenus[0].discount.discount) <= 0) return 0

    if (menu.discountMenus[0].discount.type === "percent") {
      return subtotal * (Number(menu.discountMenus[0].discount.discount) / 100)
    }

    if (menu.discountMenus[0].discount.type === "fixed") {
      return Number(menu.discountMenus[0].discount.discount) * qty
    }

    return 0
  }, [menu.discountMenus, subtotal, qty])

  const totalPrice = Math.max(subtotal - discountAmount, 0)

  /**
   * =========================
   * DISPLAY PRICE (TOP SECTION)
   * =========================
   */

  const originalPrice = Number(menu.price)
  const hasDiscount = menu.discountMenus.length > 0 && Number(menu.discountMenus[0].discount.discount) > 0

  const discountedPrice = hasDiscount ?
    menu.discountMenus[0].discount.type === "percent"
      ? originalPrice - (originalPrice * Number(menu.discountMenus[0].discount.discount)) / 100
      : originalPrice - Number(menu.discountMenus[0].discount.discount)
    : originalPrice

  return (
    <Drawer
      open={open}
      onOpenChange={(val) => {
        if (!menu.isAvailable) return
        setOpen(val)
      }}
    >
      <DrawerTrigger asChild>
        <div className="bg-primary/10 rounded-xl shadow-soft overflow-hidden flex flex-col gap-2 w-[150px]">
          <div className="relative h-28">
            <Image
              src={menu.img}
              alt={menu.name}
              fill
              className="object-cover object-top rounded-t-lg"
            />
          </div>
          <div className="absolute top-2 w-[50px] text-center mx-2 text-[10px] bg-[#E35336] text-white rounded-full px-2 py-1">No. {order}</div>

          <div className="space-y-1 p-3 text-center">
            <p className="text-sm font-medium line-clamp-1">
              {menu.name}
            </p>
            {!menu.isAvailable ? (
              <p className="text-xs font-semibold bg-[#E35336]/50 text-white rounded-full px-2 py-1">
                Sold out
              </p>
            ) : ""}
          </div>
        </div>
      </DrawerTrigger>

      <DrawerContent className="rounded-t-3xl px-4 pb-6 max-w-lg mx-auto ">
        <DrawerHeader className="p-0 my-2">
          <DrawerTitle className="text-lg font-semibold text-primary">
            Tambahkan Menu
          </DrawerTitle>
        </DrawerHeader>

        <div className="min-h-[20vh] overflow-y-auto w-full my-2">
          {/* ========================= */}
          {/* MENU INFO */}
          {/* ========================= */}

          <div className="flex gap-4 py-2 mb-2">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden">
              <Image
                src={menu.img}
                alt={menu.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium line-clamp-1">
                {menu.name}
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
                {menu.desc}
              </p>
            </div>
          </div>

          {/* ========================= */}
          {/* OPTIONS */}
          {/* ========================= */}

          {menu.options?.map((option) => (
            <OptionRenderer
              key={option.id}
              option={option}
              selectedOptions={selectedOptions}
              handleSelect={handleSelect}
            />
          ))}

          {/* ========================= */}
          {/* NOTE */}
          {/* ========================= */}

          <div className="mb-2">
            <p className="text-sm font-medium mb-2">
              Add Note{" "}
              <span className="text-muted-foreground">(Optional)</span>
            </p>
            <Textarea
              placeholder="Write a note"
              className="bg-primary/10"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        {/* ========================= */}
        {/* TOTAL + QTY */}
        {/* ========================= */}

        <div className="flex items-center justify-between px-1 mb-4">
          <div>
            <p className="text-lg font-semibold">
              Rp {totalPrice.toLocaleString("id-ID")}
            </p>

            {discountAmount > 0 && (
              <p className="text-xs text-muted-foreground">
                Hemat Rp {discountAmount.toLocaleString("id-ID")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full bg-primary/10"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
            >
              <Minus size={16} />
            </Button>

            <span className="font-medium">{qty}</span>

            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full bg-primary/10"
              onClick={() => setQty((q) => q + 1)}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>

        {/* ========================= */}
        {/* FOOTER */}
        {/* ========================= */}

        <DrawerFooter className="p-0 flex flex-row gap-2">
          <Button
            className="w-[90%] bg-primary hover:bg-primary/90 text-white rounded-xl"
            size="lg"
            onClick={() => {
              addItem({
                menuId: menu.id,
                name: menu.name,
                qty,
                note,
                img: menu.img,
                options: selectedOptions,
                menuItem: menu,

                basePrice: Number(menu.price),
                extraPrice: extraPrice,
                subtotal: subtotal,
                discountAmount: discountAmount,
                finalPrice: totalPrice,
              })

              setOpen(false)
            }}
          >
            Confirm
          </Button>
          <Button
            className="w-[10%] bg-primary/10 hover:bg-primary/20 text-primary rounded-xl"
            size="lg"
            onClick={() => setOpen(false)}
          >
            <X />
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
