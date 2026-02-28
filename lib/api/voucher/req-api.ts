import { axiosClient } from "../axios-client"

export type VouchersItem = {
  id?: string,
  name: string,
  type: string,
  discount: number,
  maxUsage: number,
  expiredAt: string,
  allMenu : boolean,
}

export type VoucherFormValue = {
  name : string,
  type : string,
  discount : number,
  maxUsage : number,
  expiredAt : string,
  allMenu : boolean,
}

export type VouchersQueryParams = {
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

export type VouchersListResponse = {
  statusCode: number
  additional: unknown
  data: VouchersItem[]
  pagination: Paginate
}

export type CreateVouchersInput = VoucherFormValue

export type UpdateVouchersInput = VoucherFormValue

export async function getVouchers(
  params?: VouchersQueryParams
): Promise<VouchersListResponse> {
  const res = await axiosClient.get<VouchersListResponse>("/vouchers", { params })
  return res.data
}

export async function createVoucher (input: CreateVouchersInput) {
  const res = await axiosClient.post("/vouchers", input)
  return res.data
}

export async function updateVoucher(id: string, input: UpdateVouchersInput) {
  const res = await axiosClient.put(`/vouchers/${id}`, input)
  return res.data
}

export async function deleteVoucher(id: string) {
  const res = await axiosClient.delete(`/vouchers/${id}`)
  return res.data
}
