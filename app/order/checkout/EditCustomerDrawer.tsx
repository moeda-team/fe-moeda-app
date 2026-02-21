"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useCustomerStore } from "@/store/customer.store"
import { Edit2 } from "lucide-react"

export function EditCustomerDrawer() {
  const { name, table, setCustomer } = useCustomerStore()

  const [open, setOpen] = useState(false)
  const [localName, setLocalName] = useState(name)
  const [localTable, setLocalTable] = useState(table)

  const handleOpen = () => {
    setLocalName(name)
    setLocalTable(table)
    setOpen(true)
  }

  const handleSave = () => {
    setCustomer({ name: localName, table: localTable })
    setOpen(false)
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="absolute top-2 right-2 rounded-full bg-[#F3A93B] text-white"
        size="xs"
      >
        <Edit2 />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4 pb-6 max-w-lg mx-auto">
          <DrawerHeader>
            <DrawerTitle>Edit Customer</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium">
                Customer Name
              </label>
              <input
                value={localName}
                onChange={(e) =>
                  setLocalName(e.target.value)
                }
                className="w-full mt-2 border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Table Number
              </label>
              <input
                value={localTable}
                type="number"
                onChange={(e) =>
                  setLocalTable(e.target.value)
                }
                className="w-full mt-2 border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <DrawerFooter>
            <Button
              className="w-full bg-[#B87333] text-white"
              onClick={handleSave}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}