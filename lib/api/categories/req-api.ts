import { axiosClient } from "../axios-client"

export type CategoriesItem = {
  id?: string,
  name: string,
  icon: string,
}

export type CategoriesFormValue = {
  name : string,
  icon : string,
}

export type CategoriesQueryParams = {
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

export type CategoriesListResponse = {
  statusCode: number
  additional: unknown
  data: CategoriesItem[]
  paginate: Paginate
}

export type CreateCategoriesInput = CategoriesFormValue

export type UpdateCategoriesInput = CategoriesFormValue

export async function getCategories(
  params?: CategoriesQueryParams
): Promise<CategoriesListResponse> {
  const res = await axiosClient.get<CategoriesListResponse>("/menus/categories", { params })
  return res.data
}

export async function createCategories (input: CreateCategoriesInput) {
  const res = await axiosClient.post("/menus/categories", input)
  return res.data
}

export async function updateCategories(id: string, input: UpdateCategoriesInput) {
  const res = await axiosClient.put(`/menus/categories/${id}`, input)
  return res.data
}

export async function deleteCategories(id: string) {
  const res = await axiosClient.delete(`/menus/categories/${id}`)
  return res.data
}
