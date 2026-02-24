import { axiosClient } from "../axios-client"

export type OptionsItem = {
  id?: string,
  name: string,
  outletId: string,
}

export type OptionsFormValue = {
  name : string,
  outletId : string,
}

export type OptionsQueryParams = {
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

export type OptionsListResponse = {
  statusCode: number
  additional: unknown
  data: OptionsItem[]
  paginate: Paginate
}

export type CreateOptionsInput = OptionsFormValue

export type UpdateOptionsInput = OptionsFormValue

export async function getOptions(
  params?: OptionsQueryParams
): Promise<OptionsListResponse> {
  const res = await axiosClient.get<OptionsListResponse>("/options", { params })
  return res.data
}

export async function createOptions (input: CreateOptionsInput) {
  const res = await axiosClient.post("/options", input)
  return res.data
}

export async function updateOptions(id: string, input: UpdateOptionsInput) {
  const res = await axiosClient.put(`/options/${id}`, input)
  return res.data
}

export async function deleteOptions(id: string) {
  const res = await axiosClient.delete(`/options/${id}`)
  return res.data
}
