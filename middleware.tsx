import { auth } from "@/auth"
import { NextResponse } from "next/server"

/**
 * =========================
 * CONFIG
 * =========================
 */
const PUBLIC_ROUTES = ["/", "/login", "/error", "/api", "/_next"]
const PUBLIC_PREFIXES = ["/order", "/images", "/public"]

const API_PREFIX = "/api"
const STATIC_PREFIXES = ["/_next", "/favicon.ico"]

const ROLE_ROUTES: Record<string, string[]> = {
  admin: ["/admin"],
  owner: ["/owner"],
}

/**
 * =========================
 * HELPERS
 * =========================
 */

function isPublicRoute(pathname: string) {
  return (
    PUBLIC_ROUTES.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) =>
      pathname.startsWith(p)
    )
  )
}

function isBypassRoute(pathname: string) {
  return (
    pathname.startsWith(API_PREFIX) ||
    STATIC_PREFIXES.some((p) => pathname.startsWith(p))
  )
}

function checkRoleAccess(pathname: string, role?: string) {
  if (!role) return false

  const normalizedRole = role.toLowerCase()

  for (const [allowedRole, routes] of Object.entries(ROLE_ROUTES)) {
    if (
      routes.some((route) => pathname.startsWith(route)) &&
      normalizedRole !== allowedRole
    ) {
      return false
    }
  }

  return true
}

/**
 * =========================
 * MIDDLEWARE
 * =========================
 */
export default auth((req) => {
  const { pathname } = req.nextUrl
  const session = req.auth
  const role = session?.user?.role

  /**
   * 1️⃣ BYPASS API & STATIC
   */
  if (isBypassRoute(pathname)) {
    return NextResponse.next()
  }

  /**
   * 2️⃣ PUBLIC ROUTE
   */
  if (isPublicRoute(pathname)) {
    if (session) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      )
    }
    return NextResponse.next()
  }

  /**
   * 3️⃣ NOT AUTHENTICATED
   */
  if (!session) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    )
  }

  /**
   * 4️⃣ ROLE CHECK
   */
  if (!checkRoleAccess(pathname, role)) {
    return NextResponse.redirect(
      new URL("/error/403", req.url)
    )
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
}