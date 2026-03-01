import { axiosClient } from "../axios-client"

export type CashBalanceItem = {
  id?: string,
  amount: number,
  type: "ADD" | "REDUCE",
  description: string,
  previousAmount: number,
  cancelNote: string | null,
  status:string
}

export type CashBalanceFormValue = {
  amount: number,
  type: "ADD" | "REDUCE",
  description: string,
  cancelNote?: string,
}

export type CashBalanceQueryParams = {
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

export type CashBalanceListResponse = {
  statusCode: number
  additional: unknown
  data: CashBalanceItem[]
  pagination: Paginate
}

export type CreateCashBalanceInput = CashBalanceFormValue

export type UpdateCashBalanceInput = CashBalanceFormValue

export async function getCashBalance(
  params?: CashBalanceQueryParams
): Promise<CashBalanceListResponse> {
  const res = await axiosClient.get<CashBalanceListResponse>("/cash-balances/logs", { params })
  return res.data
}

export async function getCashBalanceDetail(
  params?: CashBalanceQueryParams
): Promise<CashBalanceListResponse> {
  const res = await axiosClient.get<CashBalanceListResponse>("/cash-balances", { params })
  return res.data
}

export async function createCashBalance (input: CreateCashBalanceInput) {
  const res = await axiosClient.post("/cash-balances/logs", input)
  return res.data
}

export async function updateCashBalance(id: string, input: UpdateCashBalanceInput) {
  const res = await axiosClient.put(`/cash-balances/logs/${id}`, input)
  return res.data
}

export async function deleteCashBalance(id: string) {
  const res = await axiosClient.delete(`/cash-balances/logs/${id}`)
  return res.data
}
