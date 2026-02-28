import { axiosClient } from "../axios-client"

export type UserItem = {
  id:string;
  outletId:string;
  name:string;
  position:string;
  email:string;
  password:string;
  address:string;
  gender:string;
  fee:number;
  phoneNumber:string;
  role:string;
  status:string;
}

export type Roles = "EMPLOYEE" | "OWNER" | "STORE_MANAGER" | "ADMIN" | (string & {})

export const roleOptions = [
  { label: "Employee", value: "EMPLOYEE", keywords: ["super"] },
  { label: "Owner", value: "OWNER" },
  { label: "Store Manager", value: "STORE_MANAGER" },
]

export type UserFormValue = {
  name : string,
  position : string,
  role : string,
  email : string,
  password : string,
  address : string,
  gender : string,
  phoneNumber : string,
  outletId ?: string,
  status : string,
  fee ?: number,
}

export type UsersQueryParams = {
  page?: number
  limit?: number
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
  pagination: Paginate
}

export type CreateUserInput = UserFormValue

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
  const res = await axiosClient.get<UsersListResponse>("/users", { params })
  return res.data
}

export async function createUser(input: CreateUserInput) {
  const res = await axiosClient.post("/users", input)
  return res.data
}

export async function updateUser(id: string, input: UpdateUserInput) {
  const res = await axiosClient.put(`/users/${id}`, input)
  return res.data
}

export async function deleteUser(id: string) {
  const res = await axiosClient.delete(`/users/${id}`)
  return res.data
}
