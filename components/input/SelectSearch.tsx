"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export type SelectOption = {
  label: string
  value: string
  keywords?: string[] // optional buat bantu search
  disabled?: boolean
}

type BaseProps = {
  options: SelectOption[]
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  disabled?: boolean
  className?: string
  contentClassName?: string
  clearable?: boolean
}

type SingleProps = BaseProps & {
  multiple?: false
  value?: string
  onChange: (value: string) => void
}

type MultiProps = BaseProps & {
  multiple: true
  value?: string[]
  onChange: (value: string[]) => void
  maxSelected?: number
}

export type SelectSearchProps = SingleProps | MultiProps

function normalizeArray(v?: string[]) {
  return Array.isArray(v) ? v.filter(Boolean) : []
}

export function SelectSearch(props: SelectSearchProps) {
  const {
    options,
    placeholder = "Select...",
    searchPlaceholder = "Search...",
    emptyText = "No results.",
    disabled,
    className,
    contentClassName,
    clearable = true,
  } = props

  const multiple = (props as MultiProps).multiple === true

  const [open, setOpen] = React.useState(false)

  const optionMap = React.useMemo(() => {
    const m = new Map<string, SelectOption>()
    for (const o of options) m.set(o.value, o)
    return m
  }, [options])

  const selectedValues = React.useMemo(() => {
    if (multiple) return normalizeArray((props as MultiProps).value)
    const v = (props as SingleProps).value
    return v ? [v] : []
  }, [multiple, props])

  const selectedLabels = React.useMemo(() => {
    return selectedValues
      .map((v) => optionMap.get(v)?.label)
      .filter(Boolean) as string[]
  }, [selectedValues, optionMap])

  const displayText = React.useMemo(() => {
    if (multiple) {
      if (!selectedLabels.length) return placeholder
      if (selectedLabels.length === 1) return selectedLabels[0]
      return `${selectedLabels.length} selected`
    }
    return selectedLabels[0] ?? placeholder
  }, [multiple, selectedLabels, placeholder])

  const toggleValue = (val: string) => {
    if (!multiple) {
      ;(props as SingleProps).onChange(val)
      setOpen(false)
      return
    }

    const current = normalizeArray((props as MultiProps).value)
    const exists = current.includes(val)

    const maxSelected = (props as MultiProps).maxSelected
    if (!exists && typeof maxSelected === "number" && current.length >= maxSelected) {
      // kalau mau, bisa ganti jadi toast/snackbar
      return
    }

    const next = exists ? current.filter((x) => x !== val) : [...current, val]
    ;(props as MultiProps).onChange(next)
    // multi: tetap open biar enak pilih banyak
  }

  const clear = () => {
    if (!multiple) (props as SingleProps).onChange("")
    else (props as MultiProps).onChange([])
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", multiple && "min-h-10")}
            disabled={disabled}
          >
            <span className={cn("truncate text-left", !selectedValues.length && "text-muted-foreground")}>
              {displayText}
            </span>

            <span className="ml-2 inline-flex items-center gap-2">
              {clearable && selectedValues.length > 0 && !disabled && (
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    clear()
                  }}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md hover:bg-muted"
                  aria-label="Clear selection"
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </span>
              )}
              <ChevronsUpDown className="h-4 w-4 opacity-50" />
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className={cn("w-[--radix-popover-trigger-width] p-0", contentClassName)} align="start">
          <Command
            // filter custom biar keywords ikut ke-search
            filter={(value, search) => {
              const opt = optionMap.get(value)
              if (!opt) return 0
              const s = search.toLowerCase()
              const hay = `${opt.label} ${opt.value} ${(opt.keywords ?? []).join(" ")}`.toLowerCase()
              return hay.includes(s) ? 1 : 0
            }}
          >
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>

              <CommandGroup>
                {options.map((opt) => {
                  const isSelected = selectedValues.includes(opt.value)

                  return (
                    <CommandItem
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      onSelect={() => toggleValue(opt.value)}
                      className={cn(opt.disabled && "opacity-50")}
                    >
                      <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                      <span className="flex-1">{opt.label}</span>
                      {multiple && isSelected && (
                        <Badge variant="secondary" className="ml-2">
                          Selected
                        </Badge>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* chips untuk multiple */}
      {multiple && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((v) => {
            const label = optionMap.get(v)?.label ?? v
            return (
              <Badge key={v} variant="secondary" className="gap-1">
                {label}
                {!disabled && (
                  <button
                    type="button"
                    className="ml-1 rounded-sm hover:opacity-80"
                    onClick={() => toggleValue(v)}
                    aria-label={`Remove ${label}`}
                    title="Remove"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            )
          })}
        </div>
      )}
    </div>
  )
}
