import { axiosClient } from "../axios-client"
import { ResponseData } from "../response-data"

export type UserProfile = {
  id: string
  outletId: string
  name: string
  position: string
  email: string
  address: string
  gender: string
  fee: number
  phoneNumber: string
  role: string
  status: string
  image?: string
}

export type UpdateProfileInput = {
  name?: string
  position?: string
  email?: string
  address?: string
  gender?: string
  phoneNumber?: string
  image?: string
}

export async function getCurrentUser(id: string): Promise<ResponseData<UserProfile>> {
  const res = await axiosClient.get<ResponseData<UserProfile>>(`/users/${id}`)
  return res.data
}

export async function updateCurrentUser(id: string, input: UpdateProfileInput): Promise<ResponseData<UserProfile>> {
  const res = await axiosClient.put<ResponseData<UserProfile>>(`/users/${id}`, input)
  return res.data
}
