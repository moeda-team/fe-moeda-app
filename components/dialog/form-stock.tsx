"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { uomOptions, type StockItem } from "@/lib/api/inventory/req-api"
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
import type { StockFormValue } from "@/lib/api/inventory/req-api"
import { NumberInput } from "../input/NumberInput"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: StockItem | null
  loading?: boolean
  value: StockFormValue
  onChange: (value: StockFormValue) => void
  onSubmit: (data: StockFormValue) => void
}

export function StockFormDialog({
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
  } = useForm<StockFormValue>({
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
          <DialogTitle>{isEdit ? "Edit Ingredient" : "Create Ingredient"}</DialogTitle>
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

          <div className="grid gap-2">
            <Label>Unit</Label>

            <Controller
              control={control}
              name="unit"
              rules={{ required: "Unit is required" }}
              render={({ field }) => (
                <SelectSearch
                  options={uomOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Pilih unit"
                />
              )}
            />

            {errors.unit && (
              <p className="text-sm text-red-500">{errors.unit.message}</p>
            )}
          </div>

            {isEdit && (
              <div className="grid gap-2">
                <Input
                  {...register("currentStock")}
                  readOnly
                  className="bg-gray-100"
                />
              </div>
            )}

          <div className="grid gap-2">
            <NumberInput
              control={control}
              name="minimumStock"
              label="Min Stock"
              required
              min={1}
            />
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
