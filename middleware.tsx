import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl

  const isPublic =
    pathname.startsWith("/") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/error") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"

  if (isPublic) return NextResponse.next()

  if (!req.auth) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // contoh RBAC
  if (pathname.startsWith("/admin") && req.auth.user.role !== "admin") {
    const url = req.nextUrl.clone()
    url.pathname = "/error/403"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
