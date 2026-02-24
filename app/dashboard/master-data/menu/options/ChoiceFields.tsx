"use client"

import { useEffect } from "react"
import {
  Control,
  FieldArrayPath,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NumberInput } from "@/components/input/NumberInput"
import { MenuOptionFields } from "./MenuOptionFields"
import { MenuFormValueOptions } from "@/lib/option-utils"

const MAX_DEPTH = 3

type Props = {
  control: Control<MenuFormValueOptions>
  name: Path<MenuFormValueOptions>
  remove: () => void
  level?: number
}

export function ChoiceFields({
  control,
  name,
  remove,
  level = 0,
}: Props) {
  const { register, watch, setValue } =
    useFormContext<MenuFormValueOptions>()

  const labelValue = watch(
    `${name}.label` as Path<MenuFormValueOptions>
  )

  const currentValue = watch(
    `${name}.value` as Path<MenuFormValueOptions>
  )

  const {
    fields: subOptionFields,
    append,
    remove: removeSub,
  } = useFieldArray({
    control,
    name: `${name}.subOptions` as FieldArrayPath<MenuFormValueOptions>,
  })

  // 🔥 Auto-generate slug from label
  useEffect(() => {
    if (!labelValue) return

    // Jangan override kalau user sudah edit manual
    if (currentValue && currentValue !== "") return

    const slug = String(labelValue)
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w_]/g, "")

    setValue(
      `${name}.value` as Path<MenuFormValueOptions>,
      slug,
      { shouldValidate: true }
    )
  }, [labelValue, currentValue, name, setValue])

  return (
    <div className="pl-4 ml-3 border-l border-muted space-y-3">
      <div className="flex gap-2 items-center">
        {/* LABEL */}
        <Input
          {...register(`${name}.label` as Path<MenuFormValueOptions>)}
          placeholder="Choice"
          className="max-w-xs"
        />

        {/* EXTRA PRICE (default 0 handled by defaultValues & append) */}
        <NumberInput
          control={control}
          name={`${name}.extraPrice` as Path<MenuFormValueOptions>}
          currency
          currencyCode="IDR"
        />

        {/* REMOVE */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={remove}
        >
          ✕
        </Button>
      </div>

      {/* Hidden VALUE field */}
      <Input
        type="hidden"
        {...register(`${name}.value` as Path<MenuFormValueOptions>)}
      />

      {/* RECURSIVE SUB OPTIONS */}
      {subOptionFields.map((field, index) => (
        <MenuOptionFields
          key={field.id}
          control={control}
          name={`${name}.subOptions.${index}` as Path<MenuFormValueOptions>}
          remove={() => removeSub(index)}
          level={level + 1}
        />
      ))}

      {/* ⛔ Hide Add Button If Max Depth */}
      {level < MAX_DEPTH && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              label: "",
              value: "",
              extraPrice: 0, // 🔥 default langsung 0
              type: "single",
              required: false,
              choices: [],
            })
          }
        >
          + Add Sub Option
        </Button>
      )}
    </div>
  )
}