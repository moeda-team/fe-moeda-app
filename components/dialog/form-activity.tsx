"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { type ActivityItem } from "@/lib/api/activity/req-api"

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
import type { ActivityFormValue } from "@/lib/api/activity/req-api"
import { NumberInput } from "../input/NumberInput"
import { Textarea } from "../ui/textarea"
import { StockItem } from "@/lib/api/inventory/req-api"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: ActivityItem | null
  ingridientData: StockItem[]
  loading?: boolean
  value: ActivityFormValue
  onChange: (value: ActivityFormValue) => void
  onSubmit: (data: ActivityFormValue) => void
}

export function ActivityFormDialog({
  open,
  onOpenChange,
  editing,
  loading,
  value,
  onChange,
  onSubmit,
  ingridientData
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
  } = useForm<ActivityFormValue>({
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
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Activity" : "Create Activity"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">

          <div className="grid gap-2">
            <Label>Ingredient</Label>

            <Controller
              control={control}
              name="inventoryId"
              rules={{ required: "Ingredient is required" }}
              render={({ field }) => (
                <SelectSearch
                  options={ingridientData.map((item) => ({
                    value: item.id,
                    label: item.name,
                    unit: item.unit,
                  }))}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Select ingredient"
                />
              )}
            />

            {errors.inventoryId && (
              <p className="text-sm text-red-500">{errors.inventoryId.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Type</Label>

            <Controller
              control={control}
              name="type"
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <SelectSearch
                  options={[
                    { value: "ADD", label: "Add" },
                    { value: "REDUCE", label: "Reduce" },
                    { value: "ADJUST", label: "Adjust" },
                  ]}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Select type"
                />
              )}
            />

            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <NumberInput
              control={control}
              name="quantity"
              label="Quantity"
              required
              suffix={ingridientData.find((item) => item.id === watch("inventoryId"))?.unit}
            />
          </div>

          {/* NOTES */}
          <div className="grid gap-2">
            <Textarea
              {...register("notes", {
                minLength: {
                  value: 3,
                  message: "Min 3 characters",
                },
              })}
              rows={3}
              placeholder="Notes .."
            />
            {errors.notes && (
              <p className="text-sm text-red-500">
                {errors.notes.message}
              </p>
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
