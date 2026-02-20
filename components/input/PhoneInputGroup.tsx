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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Country = { code: string; label: string; dial: string } // dial = "62"
const DEFAULT_COUNTRIES: Country[] = [
  { code: "ID", label: "Indonesia", dial: "62" },
  { code: "SG", label: "Singapore", dial: "65" },
  { code: "MY", label: "Malaysia", dial: "60" },
]

function onlyDigits(v: string) {
  return (v ?? "").replace(/\D/g, "")
}

function normalizeDial(input: string) {
  // allow: "62", "+62", "+ 62"
  const d = (input ?? "").trim().replace(/\s/g, "")
  const digits = d.replace(/[^\d]/g, "")
  return digits
}

function splitE164(value: string) {
  // expects +<dial><number> or some random, best-effort
  const v = (value ?? "").trim()
  if (!v) return { dial: "62", number: "" }

  const digits = v.replace(/[^\d]/g, "")
  // try detect common Indo forms
  // 08xxx -> dial 62 number 8xxx (remove leading 0)
  if (/^08\d+/.test(digits)) return { dial: "62", number: digits.slice(1) }
  // 62xxxx -> dial 62 number xxxx
  if (/^62\d+/.test(digits)) return { dial: "62", number: digits.slice(2) }

  // fallback: assume first 1-3 digits could be dial; default 62
  return { dial: "62", number: digits.startsWith("0") ? digits.slice(1) : digits }
}

function buildE164(dial: string, number: string) {
  const d = normalizeDial(dial)
  const n = onlyDigits(number)
  if (!d && !n) return ""
  if (!d) return n ? `+${n}` : ""
  if (!n) return `+${d}`
  return `+${d}${n}`
}

function validateIndoIfDial62(dial: string, number: string) {
  const d = normalizeDial(dial)
  const n = onlyDigits(number)
  if (!d && !n) return true

  // general: minimal length for number
  if (n.length < 6) return "Phone number is too short"

  // specific ID check: must start with 8..., length 9-14 digits (after dial)
  if (d === "62") {
    if (!/^8\d+/.test(n)) return "For +62, number should start with 8 (e.g., 812...)"
    if (n.length < 9 || n.length > 14) return "Invalid Indonesian phone length"
  }
  return true
}

type PhoneInputGroupProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label?: string
  disabled?: boolean
  required?: boolean
  countries?: Country[]
  placeholderNumber?: string
  className?: string
}

export function PhoneInputGroup<TFieldValues extends FieldValues>({
  control,
  name,
  label = "Phone Number",
  disabled,
  required,
  countries = DEFAULT_COUNTRIES,
  placeholderNumber = "812xxxxxxx",
  className,
}: PhoneInputGroupProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: required ? "Phone number is required" : false,
        validate: (value) => {
          if (!value && !required) return true
          const { dial, number } = splitE164(String(value ?? ""))
          const ok = validateIndoIfDial62(dial, number)
          return ok === true ? true : ok
        },
      }}
      render={({ field, fieldState }) => {
        const error = fieldState.error?.message
        const { dial, number } = splitE164(String(field.value ?? ""))

        const setDial = (nextDial: string) => {
          field.onChange(buildE164(nextDial, number))
        }
        const setNumber = (nextNum: string) => {
          // if user paste full number like 08... / +62... into number field, handle it
          const raw = String(nextNum ?? "").trim()
          const digits = raw.replace(/[^\d]/g, "")

          // if they pasted something starting with 0 or 62, auto interpret
          if (/^08\d+/.test(digits)) {
            field.onChange(buildE164("62", digits.slice(1)))
            return
          }
          if (/^62\d+/.test(digits)) {
            field.onChange(buildE164("62", digits.slice(2)))
            return
          }

          field.onChange(buildE164(dial, onlyDigits(raw)))
        }

        return (
          <div className={["grid gap-2", className].filter(Boolean).join(" ")}>
            <Label>{label}</Label>

            <div className="flex gap-2">
              {/* Prefix / dial code */}
              <div className="flex items-center gap-2">
                {/* Select (quick pick) */}
                <Select
                  value={countries.find((c) => c.dial === normalizeDial(dial))?.code ?? "ID"}
                  onValueChange={(code) => {
                    const c = countries.find((x) => x.code === code)
                    if (c) setDial(c.dial)
                  }}
                  disabled={disabled}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.code} (+{c.dial})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Number */}
              <Input
                className="flex-1"
                inputMode="tel"
                autoComplete="tel-national"
                value={number}
                disabled={disabled}
                onChange={(e) => setNumber(e.target.value)}
                placeholder={placeholderNumber}
              />
            </div>

            {/* Preview value */}
            <p className="text-xs text-muted-foreground">
              Saved as: <span className="font-mono">{buildE164(dial, number) || "-"}</span>
            </p>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        )
      }}
    />
  )
}
