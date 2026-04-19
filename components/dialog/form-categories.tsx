"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { type CategoriesItem } from "@/lib/api/categories/req-api"

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

import type { CategoriesFormValue } from "@/lib/api/categories/req-api"
import { createFile } from "@/lib/api/file/req-api"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: CategoriesItem | null
  loading?: boolean
  value: CategoriesFormValue
  onChange: (value: CategoriesFormValue) => void
  onSubmit: (data: CategoriesFormValue) => void
}

export function CategoriesFormDialog({
  open,
  onOpenChange,
  editing,
  loading,
  value,
  onChange,
  onSubmit,
}: Props) {
  const isEdit = !!editing
  const [uploading, setUploading] = useState(false)
  const [useWebViewFallback, setUseWebViewFallback] = useState(false)

  // Detect WebView environment
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isWebView = (
      /wv/.test(userAgent) || // Android WebView
      /iphone|ipad|ipod/.test(userAgent) && /safari/.test(userAgent) === false // iOS WebView
    )
    setUseWebViewFallback(isWebView)
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CategoriesFormValue>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: value,
  })

  const iconValue = watch("icon")

  // ✅ Reset hanya saat dialog dibuka / editing berubah
  useEffect(() => {
    if (!open) return
    reset(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing?.id])

  const busy = !!loading || isSubmitting || uploading

  // ✅ Upload file langsung saat pilih
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("category", "icon")

      const res = await createFile(formData)
      const uploaded = res.data

      if (uploaded?.fileUrl) {
        // set ke form
        setValue("icon", uploaded.fileUrl, {
          shouldValidate: true,
        })

        // kirim ke parent
        onChange({
          ...value,
          icon: uploaded.fileUrl,
        })
      }
    } catch (err) {
      console.error("Upload failed:", err)
    } finally {
      setUploading(false)
    }
  }

  const submit = handleSubmit((data) => {
    onChange(data)
    onSubmit(data)
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          reset(value)
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Category" : "Create Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="grid gap-4">
          {/* NAME */}
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 3,
                  message: "Min 3 characters",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* ICON UPLOAD */}
          <div className="grid gap-2 hidden lg:block">
            <Label>Icon</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              {...(useWebViewFallback && { capture: "environment" })}
            />

            {uploading && (
              <p className="text-sm text-muted-foreground">
                Uploading...
              </p>
            )}

            {/* Preview */}
            {iconValue && (
              <img
                src={iconValue}
                alt="preview"
                className="h-16 w-16 rounded-md object-cover border"
              />
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