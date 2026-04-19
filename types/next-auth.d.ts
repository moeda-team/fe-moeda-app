import "next-auth"
import "next-auth/jwt"
import { OutletItem } from "@/lib/api/outlet/req-api"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: AppRole
    }
    accessToken?: string
    outlet?: OutletItem | null
  }

  interface User {
    role: AppRole
    accessToken?: string
    outlet?: OutletItem | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    accessToken?: string
    outlet?: OutletItem | null
  }
}
