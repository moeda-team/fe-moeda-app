import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const email = String(body?.email ?? "")
  const password = String(body?.password ?? "")

  // ✅ Demo credential (ganti ke DB / external auth)
  const ok = email === "admin@demo.com" && password === "admin123"

  if (!ok) {
    return NextResponse.json(
      { ok: false, message: "Email / password salah" },
      { status: 401 }
    )
  }

  const res = NextResponse.json({ ok: true })

  res.cookies.set("session", "valid", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 hari
  })

  return res
}
