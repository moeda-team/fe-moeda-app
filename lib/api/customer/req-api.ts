import { axiosClient } from "../axios-client"

export type CategoryItem = {
  id: string
  icon: string
  name: string
  outletId: string | null
}

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

// category
export type CategoryQueryParams = {
  search?: string
}

export type CategoryListResponse = {
  statusCode: number
  additional: unknown
  data: CategoryItem[]
  paginate: Paginate
}

export async function getCategories(
  params?: CategoryQueryParams
): Promise<CategoryListResponse> {
  const res = await axiosClient.get<CategoryListResponse>(`/menus/categories`, { params })
  return res.data
}


// menu
export type Menuitem = {
  id: string,
  outletId: string,
  name: string,
  desc: string,
  img: string,
  price: string,
  options: MenuOption[],
  pdf: string,
  categoryId: string,
  isNew: boolean,
  isBest: boolean,
  quantity: number,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
  disc: number,
  discType: string
  promoName: string
}

export type MenuQueryParams = {
  search?: string
  category?: string
  best?: string
}

export type MenuListResponse = {
  statusCode: number
  additional: unknown
  data: Menuitem[]
  paginate: Paginate
}

export type Choice = {
  label: string
  value: string
  extraPrice?: number,
  subOptions?: MenuOption[]
}

export type MenuOption = {
  id: string
  label: string
  type: "single" | "multiple"
  required?: boolean
  choices: Choice[]
}