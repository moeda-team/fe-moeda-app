// src/lib/helpers.ts

import moment, { MomentInput } from "moment"

/* ======================================================
   DATE HELPERS
====================================================== */

/**
 * Format date to specific format
 * Default: YYYY-MM-DD
 */
export const formatDate = (
  date: MomentInput,
  format: string = "YYYY-MM-DD"
): string => {
  if (!date) return ""
  return moment(date).format(format)
}

/**
 * Format date & time
 * Default: YYYY-MM-DD HH:mm
 */
export const formatDateTime = (
  date: MomentInput,
  format: string = "YYYY-MM-DD HH:mm"
): string => {
  if (!date) return ""
  return moment(date).format(format)
}

/**
 * Format only time
 */
export const formatTime = (
  date: MomentInput,
  format: string = "HH:mm"
): string => {
  if (!date) return ""
  return moment(date).format(format)
}

/**
 * Get start of day
 */
export const startOfDay = (date: MomentInput) => {
  return moment(date).startOf("day").toDate()
}

/**
 * Get end of day
 */
export const endOfDay = (date: MomentInput) => {
  return moment(date).endOf("day").toDate()
}

/**
 * Get first date of month
 */
export const startOfMonth = (date: MomentInput) => {
  return moment(date).startOf("month").toDate()
}

/**
 * Get last date of month
 */
export const endOfMonth = (date: MomentInput) => {
  return moment(date).endOf("month").toDate()
}

/**
 * Check if date is today
 */
export const isToday = (date: MomentInput): boolean => {
  return moment(date).isSame(moment(), "day")
}

/**
 * Difference in days between two dates
 */
export const diffDays = (
  start: MomentInput,
  end: MomentInput
): number => {
  return moment(end).diff(moment(start), "days")
}

/* ======================================================
   STRING HELPERS
====================================================== */

export const capitalize = (value?: string) => {
  if (!value) return ""
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export const toTitleCase = (value?: string) => {
  if (!value) return ""
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ")
}

/* ======================================================
   NUMBER HELPERS
====================================================== */

export const formatCurrency = (
  amount: number,
  locale: string = "id-ID",
  currency: string = "IDR"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

/* ======================================================
   GENERIC HELPERS
====================================================== */

/**
 * Remove undefined values from object
 */
export const cleanObject = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined && v !== null)
  ) as Partial<T>
}

/* ======================================================
   DATE DIFFERENCE (MINUTES)
====================================================== */

/**
 * Get total difference in minutes (integer)
 */
export const diffMinutes = (
  start: MomentInput,
  end: MomentInput
): number => {
  if (!start || !end) return 0
  return moment(end).diff(moment(start), "minutes")
}

/**
 * Get total difference in minutes (decimal)
 * Example: 90.5 minutes
 */
export const diffMinutesDecimal = (
  start: MomentInput,
  end: MomentInput
): number => {
  if (!start || !end) return 0
  const duration = moment.duration(
    moment(end).diff(moment(start))
  )
  return duration.asMinutes()
}

/**
 * Get absolute difference in minutes
 */
export const diffMinutesAbsolute = (
  start: MomentInput,
  end: MomentInput
): number => {
  if (!start || !end) return 0
  return Math.abs(
    moment(end).diff(moment(start), "minutes")
  )
}

/**
 * Get detailed minutes + seconds
 */
export const diffMinutesDetail = (
  start: MomentInput,
  end: MomentInput
) => {
  if (!start || !end) return null

  const duration = moment.duration(
    moment(end).diff(moment(start))
  )

  const minutes = Math.floor(duration.asMinutes())
  const seconds = duration.seconds()

  return {
    minutes,
    seconds,
  }
}