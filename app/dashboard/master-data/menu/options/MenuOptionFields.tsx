"use client"

import {
  Control,
  FieldArrayPath,
  Path,
  useFieldArray,
  useFormContext,
} from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChoiceFields } from "./ChoiceFields"
import { MenuFormValueOptions } from "@/lib/option-utils"

type Props = {
  control: Control<MenuFormValueOptions>
  name: Path<MenuFormValueOptions>
  remove: () => void
  level?: number
  parentValue?: string
}

export function MenuOptionFields({
  control,
  name,
  remove,
  level = 0,
  parentValue = "",
}: Props) {
  const { register, watch } =
    useFormContext<MenuFormValueOptions>()

    const currentOptionValue = watch(
    `${name}.label` as Path<MenuFormValueOptions>
  ) as string | undefined

  const {
    fields,
    append,
    remove: removeChoice,
  } = useFieldArray({
    control,
    name: `${name}.choices` as FieldArrayPath<MenuFormValueOptions>,
  })

  return (
    <div
      className={`
        pl-4 border-b-2 pb-4 border-dashed
        ${level > 0 ? "border-l-2 border-muted ml-3" : ""}
        space-y-4
      `}
    >
      {/* OPTION HEADER */}
      <div className="flex items-center justify-between gap-2">
        <Input
          {...register(`${name}.label` as Path<MenuFormValueOptions>)}
          placeholder="Option Label"
          className="max-w-sm"
        />

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={remove}
        >
          Remove
        </Button>
      </div>

      {/* Hidden VALUE */}
      <Input
        type="hidden"
        {...register(`${name}.value` as Path<MenuFormValueOptions>)}
      />

      {/* CHOICES */}
      <div className="space-y-3">
        {fields.map((field, index) => (
          <ChoiceFields
            key={field.id}
            control={control}
            name={`${name}.choices.${index}` as Path<MenuFormValueOptions>}
            remove={() => removeChoice(index)}
            level={level + 1}
            parentValue={parentValue ? `${parentValue}_${currentOptionValue}` : currentOptionValue}
          />
        ))}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              id: crypto.randomUUID(),
              label: "",
              value: "",
              extraPrice: 0,
              subOptions: [],
            })
          }
        >
          + Add Choice
        </Button>
      </div>
    </div>
  )
}