import { AxiosError } from "axios"

export function getErrorMessage(err: unknown, fallback = "Terjadi kesalahan") {
  if (err instanceof AxiosError) {
    return (
      err.response?.data?.message ||
      err.message ||
      fallback
    )
  }

  if (err instanceof Error) {
    return err.message
  }

  return fallback
}
