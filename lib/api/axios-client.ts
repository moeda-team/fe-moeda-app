import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios"
import { getSession } from "next-auth/react"
import { signOut } from "next-auth/react"

type RetryConfig = AxiosRequestConfig & {
  _retry?: boolean
}

/**
 * BASIC AUTH SETUP
 */
const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || ""
const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || ""
const outletId = process.env.NEXT_PUBLIC_OUTLET_ID || ""

const basicAuth =
  typeof window !== "undefined"
    ? `Basic ${btoa(`${username}:${password}`)}`
    : `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`

/**
 * AXIOS INSTANCE
 */
export const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
    "outletId": outletId
  },
  withCredentials: false,
})

/**
 * ============================
 * REQUEST INTERCEPTOR
 * ============================
 * Priority:
 * 1. If Authorization already exists → keep it
 * 2. If session token exists → use Bearer
 * 3. Else → fallback to Basic Auth
 */
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      // Kalau sudah ada Authorization custom
      if (config.headers?.Authorization) {
        return config
      }

      const session = await getSession()
      const token = session?.accessToken

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        config.headers["X-Basic-Auth"] = basicAuth
      } else {
        config.headers.Authorization = basicAuth
      }

      return config
    } catch (error) {
      return config
    }
  },
  (error) => Promise.reject(error)
)

/**
 * ============================
 * RESPONSE INTERCEPTOR
 * ============================
 * Retry once if 401
 */
axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig | undefined

    // ==============================
    // TRY REFRESH ONCE
    // ==============================
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        await getSession()
        return axiosClient(originalRequest)
      } catch {
        // lanjut ke force logout
      }
    }

    // ==============================
    // FORCE LOGOUT
    // ==============================
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        try {
          // remove next-auth session
          await signOut({ redirect: false })

          // optional: clear localStorage (kalau ada token manual)
          localStorage.clear()

          // redirect
          window.location.href = "/login"
        } catch {
          window.location.href = "/login"
        }
      }
    }

    return Promise.reject(error)
  }
)