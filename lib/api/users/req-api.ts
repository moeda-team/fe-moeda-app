import { axiosClient } from "../axios-client"

export type UserItem = {
  id: string
  fullname: string
  username: string
  phoneNumber: string | null
  email: string
  roles: string
  isVerified: boolean
}

export type UsersQueryParams = {
  page?: number
  perPage?: number
  search?: string
}

export type Paginate = {
  page: number
  perPage: number
  total: number
  lastPage: number
  prev: number | null
  next: number | null
}

export type UsersListResponse = {
  statusCode: number
  additional: unknown
  data: UserItem[]
  paginate: Paginate
}

export type CreateUserInput = {
  fullname: string
  username: string
  phoneNumber: string | null
  email: string
  roles: string
  isVerified: boolean
  password: string
}

export type UpdateUserInput = {
  fullname?: string
  username?: string
  phoneNumber?: string | null
  email?: string
  roles?: string
  isVerified?: boolean
}

export async function getUsers(
  params?: UsersQueryParams
): Promise<UsersListResponse> {
  const res = await axiosClient.get<UsersListResponse>("/v1/users", { params })
  return res.data
}

export async function createUser(input: CreateUserInput) {
  const res = await axiosClient.post("/v1/users", input)
  return res.data
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const res = await axiosClient.patch(`/v1/users/${id}`, input)
  return res.data
}

export async function deleteUser(id: string) {
  const res = await axiosClient.delete(`/v1/users/${id}`)
  return res.data
}
