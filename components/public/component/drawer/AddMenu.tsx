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
import { Menuitem } from "@/lib/api/customer/req-api"
import { OptionRenderer } from "./OptionRender"
import { useCartStore } from "@/store/cart.store"

type Props = {
  menu: Menuitem
}

export function AddMenuDrawer({ menu }: Props) {
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
      const current = prev[optionId] ?? []

      if (type === "single") {
        return { ...prev, [optionId]: [value] }
      }

      if (current.includes(value)) {
        return {
          ...prev,
          [optionId]: current.filter((v) => v !== value),
        }
      }

      return { ...prev, [optionId]: [...current, value] }
    })
  }

  /**
   * =========================
   * EXTRA PRICE (recursive safe)
   * =========================
   */
  const extraPrice = React.useMemo(() => {
    if (!menu.options?.length) return 0

    return menu.options.reduce((total, option) => {
      const selected = selectedOptions[option.id] ?? []

      const optionExtra = option.choices
        .filter((choice) => selected.includes(choice.value))
        .reduce((sum, choice) => sum + (choice.extraPrice ?? 0), 0)

      return total + optionExtra
    }, 0)
  }, [menu.options, selectedOptions])

  /**
   * =========================
   * PRICING ENGINE
   * =========================
   */

  const basePrice = Number(menu.price) + extraPrice
  const subtotal = basePrice * qty

  const discountAmount = React.useMemo(() => {
    if (!menu.disc || menu.disc <= 0) return 0

    if (menu.discType === "persentase") {
      return subtotal * (Number(menu.disc) / 100)
    }

    if (menu.discType === "nominal") {
      return Number(menu.disc)
    }

    return 0
  }, [menu.disc, menu.discType, subtotal])

  const totalPrice = Math.max(subtotal - discountAmount, 0)

  /**
   * =========================
   * DISPLAY PRICE (TOP SECTION)
   * =========================
   */

  const originalPrice = Number(menu.price)
  const hasDiscount = Number(menu.disc) > 0

  const discountedPrice =
    menu.discType === "persentase"
      ? originalPrice - (originalPrice * Number(menu.disc)) / 100
      : originalPrice - Number(menu.disc)

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button onClick={() => setOpen(true)}><ShoppingCart /> Add to Cart</Button>
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
            <div className="relative w-20 h-20 rounded-lg overflow-hidden">
              <Image
                src={menu.img}
                alt={menu.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-lg font-medium line-clamp-1">
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
