"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { type VouchersItem } from "@/lib/api/voucher/req-api"
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
import { PhoneInputGroup } from "../input/PhoneInputGroup"
import { SelectSearch } from "../input/SelectSearch"
import type { VoucherFormValue } from "@/lib/api/voucher/req-api"
import { NumberInput } from "../input/NumberInput"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: VouchersItem | null
  loading?: boolean
  value: VoucherFormValue
  onChange: (value: VoucherFormValue) => void
  onSubmit: (data: VoucherFormValue) => void
  type?: string
}

export function VoucherFormDialog({
  open,
  onOpenChange,
  editing,
  loading,
  value,
  onChange,
  onSubmit,
  type,
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
  } = useForm<VoucherFormValue>({
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

  const voucherType = watch("type")

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
          <DialogTitle>{isEdit ? "Edit Voucher" : "Create Voucher"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
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
            <Label>Type</Label>

            <Controller
              control={control}
              name="type"
              rules={{ required: "Type is required" }}
              render={({ field }) => (
                <SelectSearch
                  options={[
                    { label: "Fixed", value: "fixed" },
                    { label: "Percentage", value: "percent" },
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
              name="discount"
              label={
                voucherType === "percent"
                  ? "Discount (%)"
                  : "Discount Amount"
              }
              required
              min={1}
              max={voucherType === "percent" ? 100 : undefined}
              currency={voucherType === "fixed"}
              currencyCode="IDR"
            />
          </div>

          <div className="grid gap-2">
            <NumberInput
              control={control}
              name="maxUsage"
              label="Max Usage"
              required
              min={1}
            />
          </div>

          <div className="grid gap-2">
            <Label>Expired At</Label>
            <Input
              type="date"
              {...register("expiredAt", {
                required: "Expired At is required",
              })}
              min={new Date().toISOString().split("T")[0]}
            />
            {errors.expiredAt && (
              <p className="text-sm text-red-500">{errors.expiredAt.message}</p>
            )}
          </div>

          {type === 'discount' && (
            <div className="flex items-center justify-between rounded-md border p-3">
              <Label>Discount for all menu ?</Label>
              <Switch
                checked={watch("allMenu")}
                onCheckedChange={(v) =>
                  setValue("allMenu", v, { shouldValidate: true })
                }
              />
            </div>
          )}

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
