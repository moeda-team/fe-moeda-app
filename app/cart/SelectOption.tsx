"use client"

import * as React from "react"
import { Check, ChevronDown } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

type Props = {
  label: string
  value: string
  options: string[]
  onChange: (val: string) => void
}

export function EditableOptionTag({
  label,
  value,
  options,
  onChange,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="
            flex items-center gap-1
            bg-gray-100
            px-3 py-1.5
            rounded-lg
            text-xs
          "
        >
          ☕ {value}
          <ChevronDown size={12} />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-40 p-2">
        <div className="space-y-1">
          {options.map((opt) => (
            <Button
              key={opt}
              variant="ghost"
              className="w-full justify-between text-xs"
              onClick={() => onChange(opt)}
            >
              {opt}
              {opt === value && <Check size={14} />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
