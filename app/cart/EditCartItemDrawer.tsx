"use client"

import { OptionRenderer } from "@/components/public/component/drawer/OptionRender"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useCartStore } from "@/store/cart.store"
import { CartItem } from "@/store/cart.store"
import { Edit3 } from "lucide-react"
import { useState } from "react"

type Props = {
  item: CartItem
}

export function EditCartItemDrawer({ item }: Props) {
  const updateOption = useCartStore(
    (s) => s.updateOption
  )

  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs rounded bg-primary text-primary-foreground px-2 py-0.5 flex items-center gap-1"
      >
        Variant <Edit3 className="w-3 h-3" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4 pb-6 max-h-[90vh] overflow-y-auto">
          <DrawerHeader>
            <DrawerTitle>Edit Variant {item.name}</DrawerTitle>
          </DrawerHeader>

          {item.menuItem.options?.map((option) => (
            <OptionRenderer
              key={option.id}
              option={option}
              selectedOptions={item.options || {}}
              handleSelect={(optionId, val) =>
                updateOption(item.id, optionId, val)
              }
            />
          ))}
        </DrawerContent>
      </Drawer>
    </>
  )
}
