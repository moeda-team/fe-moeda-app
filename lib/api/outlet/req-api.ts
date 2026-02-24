import { axiosClient } from "../axios-client"

export type OutletItem = {
    id: string,
    outletType: string,
    name: string,
    address: string, //optional
    number: string, //optional
    province: string, //optional
    city: string, //optional
    postalCode: string, //optional
    status: string //optional
}

export type OutletFormValue = {
    outletType: string,
    name: string,
    address: string, //optional
    number: string, //optional
    province: string, //optional
    city: string, //optional
    postalCode: string, //optional
    status: string //optional
}

export type OutletQueryParams = {
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

export type OutletListResponse = {
  statusCode: number
  additional: unknown
  data: OutletItem[]
  paginate: Paginate
}

export type CreateOutletInput = OutletFormValue

export type UpdateOutletInput = OutletFormValue

export async function getOutlets(
  params?: OutletQueryParams
): Promise<OutletListResponse> {
  const res = await axiosClient.get<OutletListResponse>("/outlets", { params })
  return res.data
}

export async function createOutlet (input: CreateOutletInput) {
  const res = await axiosClient.post("/outlets", input)
  return res.data
}

export async function updateOutlet(id: string, input: UpdateOutletInput) {
  const res = await axiosClient.put(`/outlets/${id}`, input)
  return res.data
}

export async function deleteOutlet(id: string) {
  const res = await axiosClient.delete(`/outlets/${id}`)
  return res.data
}
