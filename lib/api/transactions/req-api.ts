import { axiosClient } from "../axios-client"
import { TransactionOrder } from "../customer/req-api"

export type TransactionsQueryParams = {
  page?: number
  limit?: number
  search?: string
  status?: string
  paymentStatus?: string
}

export type Paginate = {
  page: number
  perPage: number
  total: number
  lastPage: number
  prev: number | null
  next: number | null
}

export type TransactionsListResponse = {
  statusCode: number
  additional: unknown
  data: {transactions: TransactionOrder[]}
  pagination: Paginate
}

export type UpdateTransactionsInput = {
  status: string
}

export type UpdateTransactionsInputMenu = {
  discountId: string,
  menuId: string[]
}

export async function getTransactionsActive(
  params?: TransactionsQueryParams
): Promise<TransactionsListResponse> {
  const res = await axiosClient.get<TransactionsListResponse>("/transactions/main", { params })
  return res.data
}

export async function updateTransaction(id: string, input: UpdateTransactionsInput) {
  const res = await axiosClient.patch(`/transactions/main/status/${id}`, input)
  return res.data
}
