"use client"

import {
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form"
import { v4 as uuid } from "uuid"
import { Button } from "@/components/ui/button"
import { MenuOptionFields } from "./MenuOptionFields"
import { MenuFormValueOptions } from "@/lib/option-utils"
import { Plus, Save } from "lucide-react"

interface Props {
  value?: MenuFormValueOptions
  onSubmit?: (data: MenuFormValueOptions) => void
}

export default function MenuRecursiveForm({ value, onSubmit }: Props) {
  const methods = useForm<MenuFormValueOptions>({
    defaultValues: {
      menuId: value?.menuId || "",
      data: value?.data || [],
    },
  })

  const { control, handleSubmit } = methods

  const { fields, append, remove } = useFieldArray({
    control,
    name: "data",
  })

  const submit = (data: MenuFormValueOptions) => {
    onSubmit?.(data)
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submit)}
        className="flex flex-col justify-between space-y-6 space-x-2"
      >
        {fields.map((field, index) => (
          <MenuOptionFields
            key={field.id}
            control={control}
            name={`data.${index}`}
            remove={() => remove(index)}
            parentValue={fields[index]?.label}
          />
        ))}

        {fields.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No options added yet. Click{" "}
            <strong>Add Option</strong> to get started.
          </div>
        )}

        {/* FOOTER */}
        <div className="bg-muted absolute bottom-0 left-0 right-0 p-4 flex gap-2 justify-end border-t">
          <Button
            type="button"
            className="w-36"
            onClick={() =>
              append({
                id: uuid(),
                label: "",
                value: "",
                type: "single",
                required: false,
                choices: [],
              })
            }
          >
            <Plus /> Add Option
          </Button>

          <Button type="submit" className="w-36">
            <Save /> Save
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}