"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { type CashBalanceItem } from "@/lib/api/cash-balance/req-api"
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
import type { CashBalanceFormValue } from "@/lib/api/cash-balance/req-api"
import { NumberInput } from "../input/NumberInput"
import { Textarea } from "../ui/textarea"
import { SelectSearch } from "../input/SelectSearch"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: CashBalanceItem | null
  loading?: boolean
  value: CashBalanceFormValue
  onChange: (value: CashBalanceFormValue) => void
  onSubmit: (data: CashBalanceFormValue) => void
}

export function CashBalanceFormDialog({
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
    control,
  } = useForm<CashBalanceFormValue>({
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
          <DialogTitle>{isEdit ? "Cancel Cash / Balance" : "New Cash / Balance"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
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
                  ]}
                  value={field.value}
                  className={isEdit ? "bg-gray-200" : ""}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Select type"
                  disabled={isEdit}
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
              name="amount"
              label="Amount"
              required
              min={1000}
              currency
              disabled={isEdit}
            />
          </div>

          <div className="grid gap-2">
            <Label>Description</Label>
            <Textarea
              {...register("description", {
                minLength: {
                  value: 3,
                  message: "Min 3 characters",
                },
                required: "Description is required",
              })}
              className={isEdit ? "bg-gray-200" : ""}
              rows={3}
              placeholder="Description .."
              disabled={isEdit}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          
          {isEdit && 
            <div className="grid gap-2">
              <Label>Cancel Notes</Label>
              <Textarea
                {...register("cancelNote", {
                  minLength: {
                    value: 3,
                    message: "Min 3 characters",
                  },
                  required: "Cancel note is required",
                })}
                rows={3}
                placeholder="Cancel note .."
              />
              {errors.cancelNote && (
                <p className="text-sm text-red-500">
                  {errors.cancelNote.message}
                </p>
              )}
            </div>
          }

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
