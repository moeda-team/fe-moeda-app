"use client"

import { useEffect, useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { type OutletItem } from "@/lib/api/outlet/req-api"
import { Switch } from "@/components/ui/switch"
import { createFile } from "@/lib/api/file/req-api"
import Image from "next/image"

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
import type { OutletFormValue } from "@/lib/api/outlet/req-api"

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
  const [colorValue, setColorValue] = useState("#ffffff")
  const [uploadingImg, setUploadingImg] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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

  // Color sync handlers
  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setColorValue(color)
    setValue("color", color, { shouldValidate: true })
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value
    setColorValue(color)
    
    // Manual validation
    const hexPattern = /^#[0-9A-Fa-f]{6}$/
    if (hexPattern.test(color)) {
      setValue("color", color, { shouldValidate: true })
    } else {
      setValue("color", color, { shouldValidate: false })
    }
  }

  // Sync color value from form state
  const watchedColor = watch("color")
  const imgValue = watch("img")
  useEffect(() => {
    if (watchedColor && watchedColor !== colorValue) {
      setColorValue(watchedColor)
    }
  }, [watchedColor, colorValue])

  // Image upload handler
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingImg(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", "menu")

      const res = await createFile(formData)
      const uploaded = res.data

      if (uploaded?.fileUrl) {
        setValue("img", uploaded.fileUrl, {
          shouldValidate: true,
        })
      }
    } finally {
      setUploadingImg(false)
    }
  }

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
          
          <div className="grid gap-2">
            <Label>Base Color</Label>
            <div className="flex items-center gap-3">
              <Input
                type="color"
                className="w-16 h-10 p-1 border rounded cursor-pointer"
                value={colorValue}
                onChange={handleColorPickerChange}
              />
              <Input
                type="text"
                placeholder="#ffffff"
                readOnly
                className="flex-1 bg-gray-100 uppercase"
                value={colorValue}
                onChange={handleTextChange}
              />
            </div>
            {errors.color && (
              <p className="text-sm text-red-500">{errors.color.message}</p>
            )}
          </div>

          {/* IMAGE UPLOAD */}
          <div className="grid gap-2">
            <Label>Logo Outlet</Label>
            <div className="flex items-start gap-4">
              {/* IMAGE PREVIEW */}
              <div className="flex-shrink-0">
                <div className="relative h-24 w-24">
                  {!imgValue ? (
                    <div className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-500">No Image</span>
                    </div>
                  ) : (
                    <Image
                      src={imgValue}
                      alt="Outlet Logo"
                      fill
                      className="object-cover rounded-md border cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    />
                  )}
                </div>
              </div>

              {/* URL FIELD & UPLOAD */}
              <div className="flex-1 space-y-2">
                {/* URL Input */}
                <div className="grid gap-1">
                  <Label className="text-xs text-gray-600">Image URL</Label>
                  <Input
                    placeholder="https://example.com/image.jpg"
                    {...register("img")}
                  />
                </div>

                {/* Hidden File Input */}
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Upload Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImg}
                  className="w-full"
                >
                  {uploadingImg ? "Uploading..." : "Upload Image"}
                </Button>

                {uploadingImg && (
                  <p className="text-xs text-muted-foreground">
                    Uploading image...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* <div className="flex items-center justify-between rounded-md border p-3">
            <Label>Status </Label>
            <Switch
              checked={watch("status") === "active"}
              onCheckedChange={(v) =>
                setValue("status", v ? "active" : "inactive", { shouldValidate: true })
              }
            />
          </div> */}

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
