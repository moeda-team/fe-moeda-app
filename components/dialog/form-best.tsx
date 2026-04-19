"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { type TablesItem } from "@/lib/api/tables/req-api"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { NumberInput } from "../input/NumberInput"
import { BestSellerMenu } from "@/lib/api/menu/req-api"
import { Input } from "@/components/ui/input"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: BestSellerMenu | null
  loading?: boolean
  value: BestSellerMenu
  onChange: (value: BestSellerMenu) => void
  onSubmit: (data: BestSellerMenu) => void
}

export function BestSellerFormDialog({
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
    handleSubmit,
    formState: { errors, isSubmitting },
  register,
    reset,
    control,
  } = useForm<BestSellerMenu>({
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
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
          <Input
            {...register("menuId")}
            className="hidden"
          />
          <div className="grid gap-2">
            <NumberInput
              control={control}
              name="order"
              label="Order Ke "
              required
              min={1}
            />
            {errors.order && (
              <p className="text-sm text-red-500">{errors.order.message}</p>
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
