"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { type TablesItem } from "@/lib/api/tables/req-api"
import { Switch } from "@/components/ui/switch"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectSearch } from "../input/SelectSearch"
import type { TableFormValue } from "@/lib/api/tables/req-api"
import { NumberInput } from "../input/NumberInput"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: TablesItem | null
  loading?: boolean
  value: TableFormValue
  onChange: (value: TableFormValue) => void
  onSubmit: (data: TableFormValue) => void
}

export function TablesFormDialog({
  open,
  onOpenChange,
  editing,
  loading,
  value,
  onChange,
  onSubmit,
}: Props) {
  const isEdit = !!editing

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    control,
    watch,
  } = useForm<TableFormValue>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: value,
  })

  // ✅ Reset hanya saat dialog dibuka atau editing berubah (bukan setiap value berubah)
  useEffect(() => {
    if (!open) return
    reset(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing?.id, reset]) // penting: JANGAN depend ke `value`

  const busy = !!loading || isSubmitting

  const submit = handleSubmit((data) => {
    // ✅ kirim form terbaru ke parent hanya saat submit
    onChange(data)
    onSubmit(data)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          // optional: balikin ke value terakhir saat tutup
          reset(value)
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Table" : "Create Table"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
          <Input
            type="hidden"
            {...register("outletId", {
              required: "Outlet ID is required",
            })}
          />
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              {...register("name", {
                required: "Name is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={busy} className="dark:text-white">
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
