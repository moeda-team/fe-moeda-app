"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { type OutletItem } from "@/lib/api/outlet/req-api"
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
import type { OutletFormValue } from "@/lib/api/outlet/req-api"
import { NumberInput } from "../input/NumberInput"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: OutletItem | null
  loading?: boolean
  value: OutletFormValue
  onChange: (value: OutletFormValue) => void
  onSubmit: (data: OutletFormValue) => void
}

export function OutletFormDialog({
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
  } = useForm<OutletFormValue>({
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
          <DialogTitle>{isEdit ? "Edit Outlet" : "Create Outlet"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Outlet Type</Label>
            <Input
              {...register("outletType", {
                required: "Outlet Type is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.outletType && (
              <p className="text-sm text-red-500">{errors.outletType.message}</p>
            )}
          </div>

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
            <Label>Address</Label>
            <Input
              {...register("address", {
                required: "Address is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Phone Number</Label>
            <Input
              {...register("number", {
                required: "Phone Number is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>City</Label>
            <Input
              {...register("city", {
                required: "City is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Province</Label>
            <Input
              {...register("province", {
                required: "Province is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.province && (
              <p className="text-sm text-red-500">{errors.province.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Postal Code</Label>
            <Input
              {...register("postalCode", {
                required: "Postal Code is required",
                minLength: { value: 3, message: "Min 3 characters" },
              })}
            />
            {errors.postalCode && (
              <p className="text-sm text-red-500">{errors.postalCode.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Status </Label>
            <Switch
              checked={watch("status") === "active"}
              onCheckedChange={(v) =>
                setValue("status", v ? "active" : "inactive", { shouldValidate: true })
              }
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
