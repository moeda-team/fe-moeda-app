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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { useCustomerStore } from "@/store/customer.store"
import { Edit2 } from "lucide-react"
import { TablesItem } from "@/lib/api/tables/req-api"

interface EditCustomerDrawerProps {
  tableOptions?: TablesItem[]
}

export function EditCustomerDrawer({ tableOptions }: EditCustomerDrawerProps) {
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
        <Edit2 size={16} />
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4 pb-6 max-w-lg mx-auto">
          <DrawerHeader>
            <DrawerTitle>Edit Customer</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 mt-2">
            {/* NAME */}
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

            {/* TABLE LIST */}
            <div>
              <label className="text-sm font-medium">
                Table
              </label>

              <Select
                value={localTable}
                onValueChange={(value) =>
                  setLocalTable(value)
                }
              >
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tableOptions && tableOptions?.length > 0 && tableOptions?.map((t) => (
                    <SelectItem key={t.id} value={t.id ?? ""}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DrawerFooter>
            <Button
              className="w-full bg-[#B87333] text-white"
              onClick={handleSave}
              disabled={!localName || !localTable}
            >
              Save
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}