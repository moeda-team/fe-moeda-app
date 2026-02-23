"use client"

import { useState } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { TablesItem } from "@/lib/api/tables/req-api"


interface SwitchTableDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentTable?: string
  tableOptions: TablesItem[]
  onSubmit: (data: {
    fromTable: string
    tableId: string
    note?: string
  }) => void
}

export function SwitchTableDrawer({
  open,
  onOpenChange,
  currentTable,
  tableOptions,
  onSubmit,
}: SwitchTableDrawerProps) {
  const [movingTable, setMovingTable] = useState("")
  const [note, setNote] = useState("")

  const handleSubmit = () => {
    if (!currentTable || !movingTable) return

    onSubmit({
      fromTable: currentTable,
      tableId: movingTable,
      note,
    })

    setMovingTable("")
    setNote("")
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-6 pb-6 max-w-lg mx-auto rounded-t-2xl">
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-xl font-semibold">
            Switch Table
          </DrawerTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Please find an empty table to transfer your order.
          </p>
        </DrawerHeader>

        {/* TABLE SECTION */}
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-center gap-4">
            {/* Starting */}
            <div className="w-full">
              <p className="text-sm font-medium mb-2">
                Starting table
              </p>
              <div className="border rounded-lg px-4 py-2 bg-muted text-sm">
                {tableOptions.find((t) => t.id === currentTable)?.name || "-"}
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center items-center">
              <ArrowRight className="w-6 h-6 text-black font mt-6" />
            </div>

            {/* Moving */}
            <div className="w-full">
              <p className="text-sm font-medium mb-2">
                Moving table
              </p>
              <Select
                value={movingTable}
                onValueChange={setMovingTable}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select table" />
                </SelectTrigger>
                <SelectContent>
                  {tableOptions.map((t) => (
                    <SelectItem
                      key={t.id}
                      value={t.id ?? ""}
                      disabled={t.id === currentTable}
                    >
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NOTE */}
          <div>
            <p className="text-sm font-medium mb-2">Note</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="contoh : karena hujan dan belum dapet nomor meja, saya di area belakang"
              className="w-full border rounded-lg px-4 py-3 text-sm resize-none"
              rows={3}
            />
          </div>
        </div>

        <DrawerFooter className="mt-6">
          <Button
            className="w-full bg-[#B87333] text-white hover:opacity-90"
            onClick={handleSubmit}
            disabled={!movingTable}
          >
            Switch Table
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}