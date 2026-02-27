import { axiosClient } from "../axios-client"

export type StockItem = {
    id: string,
    name: string,
    stock: number,
    minStock: number,
    maxStock: number,
    status: string //optional
}

export type StockFormValue = {
    name: string,
    stock: number,
    minStock: number,
    maxStock: number,
    status: string //optional
}

export type StockQueryParams = {
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

export type StockListResponse = {
  statusCode: number
  additional: unknown
  data: StockItem[]
  paginate: Paginate
}

export type CreateStockInput = StockFormValue

export type UpdateStockInput = StockFormValue

export async function getStocks(
  params?: StockQueryParams
): Promise<StockListResponse> {
  const res = await axiosClient.get<StockListResponse>("/stocks", { params })
  return res.data
}

export async function createStock (input: CreateStockInput) {
  const res = await axiosClient.post("/stocks", input)
  return res.data
}

export async function updateStock(id: string, input: UpdateStockInput) {
  const res = await axiosClient.put(`/stocks/${id}`, input)
  return res.data
}

export async function deleteStock(id: string) {
  const res = await axiosClient.delete(`/stocks/${id}`)
  return res.data
}
