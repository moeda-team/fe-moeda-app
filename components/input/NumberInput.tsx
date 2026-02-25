"use client"

import * as React from "react"
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type NumberInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  required?: boolean
  disabled?: boolean
  currency?: boolean
  locale?: string
  currencyCode?: string
  min?: number
  max?: number
  className?: string
  placeholder?: string
}

function formatCurrency(
  value: number,
  locale: string,
  currency: string
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function onlyDigits(value: string) {
  return value.replace(/[^\d]/g, "")
}

export function NumberInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
  currency = false,
  locale = "id-ID",
  currencyCode = "IDR",
  min,
  max,
  className,
  placeholder,
}: NumberInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? "This field is required" : false,
        validate: (value) => {
          if (value === undefined || value === null || value === "") {
            return required ? "This field is required" : true
          }

          const num = Number(value)

          if (isNaN(num)) return "Invalid number"

          if (min !== undefined && num < min)
            return `Minimum value is ${min}`

          if (max !== undefined && num > max)
            return `Maximum value is ${max}`

          return true
        },
      }}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message

        const numericValue = Number(field.value ?? 0)

        const displayValue =
          currency && field.value
            ? formatCurrency(numericValue, locale, currencyCode)
            : field.value ?? ""

        return (
          <div className={["grid gap-2", className].filter(Boolean).join(" ")}>
            {label && <Label>{label}</Label>}

            <Input
              inputMode="numeric"
              disabled={disabled}
              placeholder={placeholder}
              value={displayValue}
              onChange={(e) => {
                const raw = e.target.value

                if (currency) {
                  const digits = onlyDigits(raw)
                  field.onChange(digits ? Number(digits) : "")
                } else {
                  field.onChange(raw)
                }
              }}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
      }}
    />
  )
}