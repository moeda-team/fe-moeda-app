import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { OutletItem } from "./lib/api/outlet/req-api"

type LoginResponse = {
  token?: string
  accessToken?: string
  data?: {
    token?: string
    accessToken?: string
    name?: string
    email?: string,
    role?: string,
    token_type?: string,
    expires_in?: number,
    ext_expires_in?: number,
    access_token?: string,
    expires_on?: string,
    outlet?: OutletItem
  }
}

type MeResponse = {
  statusCode: number
  additional: unknown
  data: {
    id: string
    fullname: string
    email: string
    isActive: boolean
    phoneNumber: string | null
    verifiedAt: string | null
    profile: {
      avatar: string | null
      address: string | null
      updatedAt: string | null
    } | null
    role: string // contoh: "ADMIN"
  }
}

function pickToken(json: LoginResponse): string {
  return (
    json.accessToken ??
    json.token ??
    json.data?.accessToken ??
    json.data?.token ??
    ""
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 12, // ✅ 12 jam
    updateAge: 60 * 60,   // ✅ refresh tiap 1 jam kalau user aktif (sliding)
  },

  jwt: {
    maxAge: 60 * 60 * 12, // ✅ 12 jam
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const email = String(credentials?.username ?? "")
        const password = String(credentials?.password ?? "")
        if (!email || !password) return null

        // 1) LOGIN
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        if (!loginRes.ok) return null

        const loginJson = (await loginRes.json()) as LoginResponse
        const accessToken = loginJson.data?.access_token
        
        if (!accessToken) return null
         return {
            id: loginJson.data?.email,
            name: loginJson.data?.name,
            email: loginJson.data?.email,
            image: null,
            role: loginJson.data?.role ?? "",
            outlet: loginJson.data?.outlet ?? null,
            accessToken,
          }

        // 2) GET ME (ROLE REAL)
        // const meRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/me`, {
        //   method: "GET",
        //   headers: {
        //     Authorization: `Bearer ${accessToken}`,
        //     "Content-Type": "application/json",
        //   },
        //   cache: "no-store",
        // })

        // if (!meRes.ok) return null

        // const meJson = (await meRes.json()) as MeResponse
        // const me = meJson.data


        // NextAuth butuh object user-like
        // return {
        //   id: me.id,
        //   name: me.fullname,
        //   email: me.email,
        //   image: me.profile?.avatar ?? null,
        //   role: me.role ?? "",
        //   accessToken, // simpan token backend buat call API lain
        // }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.outlet = user.outlet
        token.role = (user as { role: string }).role
        token.accessToken = (user as { accessToken?: string }).accessToken
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "")
        session.user.role = (token.role as string) ?? "user"
        session.user.name = typeof token.name === "string" ? token.name : session.user.name
        session.user.email = typeof token.email === "string" ? token.email : session.user.email
        session.user.image = typeof token.picture === "string" ? token.picture : session.user.image
      }

      session.accessToken =
        typeof token.accessToken === "string" ? token.accessToken : undefined

      // Add outlet to session
      session.outlet = token.outlet as OutletItem | null

      return session
    },
  },

  pages: { signIn: "/login" },
})
