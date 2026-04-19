"use client"

import { useEffect } from "react"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
  useForm,
  useFieldArray,
  Controller,
} from "react-hook-form"

import { MenuIngredient, MenuIngredientForm } from "@/lib/api/menu/req-api"
import { SelectSearch } from "@/components/input/SelectSearch"
import { StockItem } from "@/lib/api/inventory/req-api"
import { NumberInput } from "@/components/input/NumberInput"
import { watch } from "fs"
import { Trash2 } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: MenuIngredient[] | null
  onSubmit: (data: MenuIngredientForm) => void
  menuId: string
  ingridientData: StockItem[]
}

export function FormIngridientDrawer({
  open,
  onOpenChange,
  value,
  onSubmit,
  menuId,
  ingridientData,
}: Props) {
  const form = useForm<MenuIngredientForm>({
    defaultValues: {
      menuId,
      ingredients: [],
    },
  })

  const { control, handleSubmit, reset, formState: { errors }, watch } = form

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })

  // 🔥 sync edit mode
  useEffect(() => {
    if (value) {
      reset({
        menuId,
        ingredients: value.map((v) => ({
          ingredientId: v.ingredientId,
          quantity: v.quantity,
        })),
      })
    } else {
      reset({
        menuId,
        ingredients: [],
      })
    }
  }, [value, menuId, reset])

  const handleAdd = () => {
    append({
      ingredientId: "",
      quantity: 1,
    })
  }

  const submit = handleSubmit((data) => {
    onSubmit?.({menuId, ingredients: data.ingredients.map((v) => ({
      ingredientId: v.ingredientId,
      quantity: Number(v.quantity),
    }))} as MenuIngredientForm)
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="w-full flex flex-col">
        <DrawerHeader>
          <DrawerTitle>Ingredient Settings</DrawerTitle>
        </DrawerHeader>

        <form
          onSubmit={submit}
          className="flex flex-col flex-1"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3"
              >
                {/* Ingredient ID */}
                <div className="grid gap-2">
                <Label>Ingredient</Label>
    
                <Controller
                  control={control}
                  name={`ingredients.${index}.ingredientId`}
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
    
                {errors.ingredients?.[index]?.ingredientId && (
                  <p className="text-sm text-red-500">{errors.ingredients?.[index]?.ingredientId.message}</p>
                )}
              </div>

                {/* Quantity */}
                
                <div className="flex gap-2 items-end">
                  <NumberInput
                    control={control}
                    className="w-full"
                    name={`ingredients.${index}.quantity`}
                    label="Quantity"
                    required
                    suffix={ingridientData.find((item) => item.id === watch(`ingredients.${index}.ingredientId`))?.unit}
                  />

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="dark:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={handleAdd}
              className="dark:text-white"
            >
              + Add Ingredient
            </Button>
          </div>

          <div className="p-4 border-t">
            <Button type="submit" className="w-full dark:text-white">
              Save Ingredients
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  )
}