"use client"

import * as React from "react"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { roleOptions, type UserItem } from "@/lib/api/users/req-api"

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
import type { UserFormValue } from "@/lib/api/users/req-api"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: UserItem | null
  loading?: boolean
  value: UserFormValue
  onChange: (value: UserFormValue) => void
  onSubmit: (data: UserFormValue) => void
}

export function UserFormDialog({
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
  } = useForm<UserFormValue>({
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
    onSubmit({...data, roles : undefined, position :data.roles ? data.roles?.replace("_", " ").toLowerCase() : ""})
  })

  // const verified = watch("isVerified")

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
          <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
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
            <PhoneInputGroup<UserFormValue>
              control={control}
              name="phoneNumber"
              label="Phone Number"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Alamat</Label>
            <Input
              type="text"
              {...register("address", {
                required: "Alamat is required",
              })}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Jenis Kelamin</Label>

            <Controller
              control={control}
              name="gender"
              rules={{ required: "Gender is required" }}
              render={({ field }) => (
                <SelectSearch
                  options={[
                    { label: "Laki-laki", value: "male" },
                    { label: "Perempuan", value: "female" },
                  ]}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Pilih gender"
                />
              )}
            />

            {errors.gender && (
              <p className="text-sm text-red-500">{errors.gender.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Roles</Label>

            <Controller
              control={control}
              name="roles"
              rules={{ required: "Role is required" }}
              render={({ field }) => (
                <SelectSearch
                  options={roleOptions}
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                  placeholder="Pilih role"
                />
              )}
            />

            {errors.roles && (
              <p className="text-sm text-red-500">{errors.roles.message}</p>
            )}
          </div>

          {/* <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Verified</Label>
            <Switch
              checked={verified}
              onCheckedChange={(v) =>
                setValue("isVerified", v, { shouldValidate: true })
              }
            />
          </div> */}

          <div className="grid gap-2">
            <Label>Password {isEdit ? "(optional)" : ""}</Label>
            <Input
              type="password"
              {...register("password", {
                required: isEdit ? false : "Password is required",
                validate: (v) => {
                  if (isEdit && !v) return true
                  if (!v || v.length < 6) return "Min 6 characters"
                  return true
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
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
            <Button type="submit" disabled={busy}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
