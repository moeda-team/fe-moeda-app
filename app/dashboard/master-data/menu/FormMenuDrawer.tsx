"use client"

import { useEffect, useRef, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createFile } from "@/lib/api/file/req-api"
import Image from "next/image"
import { NumberInput } from "@/components/input/NumberInput"
import { SelectSearch } from "@/components/input/SelectSearch"
import { useCategoriesQuery } from "./categories/hooks/use"
import { MenuForm } from "@/lib/api/menu/req-api"
import { Textarea } from "@/components/ui/textarea"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value?: MenuForm
  onSubmit?: (data: MenuForm) => void
}

export function FormMenuDrawer({
  open,
  onOpenChange,
  value,
  onSubmit,
}: Props) {
  const [uploadingImg, setUploadingImg] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
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
    watch,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuForm>({
    mode: "onChange",
    defaultValues: value ?? {
      categoryId: "",
      name: "",
      desc: "",
      img: "https://moeda-space.s3.ap-southeast-1.amazonaws.com/default.png",
      price: 0,
    },
  })

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imgValue = watch("img")

  const { data : categoriesData } = useCategoriesQuery()

  // reset saat drawer dibuka
  useEffect(() => {
    if (!open) return
    reset(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const busy =
    isSubmitting || uploadingImg || uploadingPdf

  // 🔥 Upload Image
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

  const submit = handleSubmit((data) => {
    onSubmit?.({...data, img: imgValue === "" ? "https://moeda-space.s3.ap-southeast-1.amazonaws.com/default.png" : imgValue})
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full flex flex-col lg:min-w-[500px] min-w-[300px]">
        <DrawerHeader>
          <DrawerTitle>
            {value?.name ? "Edit Menu" : "Create Menu"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={submit} className="grid gap-4">

            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="col-span-1">
                {/* IMAGE */}
                <div className="grid gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    {...(useWebViewFallback && { capture: "environment" })}
                  />

                  {!imgValue && (
                    <div className="relative h-32 w-32">
                      <Image
                        src="https://moeda-space.s3.ap-southeast-1.amazonaws.com/default.png"
                        alt="preview"
                        fill
                        className="object-cover rounded-md border cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      />
                    </div>
                  )}

                  {uploadingImg && (
                    <p className="text-sm text-muted-foreground">
                      Uploading image...
                    </p>
                  )}

                  {imgValue && (
                    <div className="relative h-32 w-32">
                      <Image
                        src={imgValue}
                        alt="preview"
                        fill
                        className="object-cover rounded-md border cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                {/* NAME */}
                <div className="grid gap-2">
                  <Input
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 3,
                        message: "Min 3 characters",
                      },
                    })}
                    placeholder="Menu Name .."
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* CATEGORY ID */}
                <div className="grid gap-2">
                  <Controller
                    control={control}
                    name="categoryId"
                    rules={{ required: "Category is required" }}
                    render={({ field }) => (
                      <SelectSearch
                        options={categoriesData?.data?.map((item) => ({
                          label: item.name ?? "",
                          value: item.id ?? "",
                        })) || []}
                        value={field.value}
                        onChange={(v) => field.onChange(v)}
                        placeholder="Pilih Category"
                      />
                    )}
                  />

                  {errors.categoryId && (
                    <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                  )}
                </div>

                {/* PRICE */}
                <div className="grid gap-2">
                  <NumberInput
                    control={control}
                    name="price"
                    required
                    currency
                    min={1000}
                    currencyCode="IDR"
                    placeholder="Price ..."
                  />
                </div>

              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="grid gap-2">
              <Textarea
                {...register("desc", {
                  required: "Description is required",
                  minLength: {
                    value: 3,
                    message: "Min 3 characters",
                  },
                })}
                rows={3}
                placeholder="Description .."
              />
              {errors.desc && (
                <p className="text-sm text-red-500">
                  {errors.desc.message}
                </p>
              )}
            </div>

            {/* PDF */}
            {/* <div className="grid gap-2">
              <Label>PDF</Label>
              <Input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={uploadingPdf}
              />

              {uploadingPdf && (
                <p className="text-sm text-muted-foreground">
                  Uploading PDF...
                </p>
              )}

              {pdfValue && (
                <p className="text-sm text-green-600">
                  PDF uploaded
                </p>
              )}
            </div> */}

          </form>
        </div>

        <DrawerFooter className=" bg-primary/10">
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="dark:text-white"
              disabled={busy}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              onClick={submit}
              className="dark:text-white"
              disabled={busy}
            >
              {value ? "Save" : "Create"}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}