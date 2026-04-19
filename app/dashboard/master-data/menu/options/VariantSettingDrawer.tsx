"use client"

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import MenuRecursiveForm from "./MenuRecursiveForm"
import { MenuOption } from "@/lib/api/customer/req-api"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: MenuOption[] | null
  onSubmit: (data: MenuOption[]) => void
}

export function VariantSettingDrawer({
  open,
  onOpenChange,
  value,
  onSubmit,
}: Props) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Variant Settings</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <MenuRecursiveForm
            value={value ? { menuId: "", data: value } : undefined}
            onSubmit={(data) => onSubmit(data.data)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}