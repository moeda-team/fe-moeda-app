import { axiosClient } from "../axios-client"

export type StockItem = {
  id: string
  outletId: string
  name: string
  unit: string
  currentStock: number
  minimumStock: number
  status: string
}

export type StockFormValue = {
  outletId: string
  name: string
  unit: string
  currentStock: number
  minimumStock: number
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

export type StatusListResponse = {
  data : {
    SAFE: number
    LOW: number
    OUT: number
    total: number
  }
}

export const uomOptions = [
  { label: "Pieces", value: "pcs" },
  { label: "Cup", value: "cup" },
  { label: "Glass", value: "glass" },
  { label: "Shot", value: "shot" },
  { label: "Milliliter", value: "ml" },
  { label: "Liter", value: "liter" },
  { label: "Gram", value: "gram" },
  { label: "Kilogram", value: "kilogram" },
  { label: "Bottle", value: "bottle" },
  { label: "Pack", value: "pack" },
  { label: "Box", value: "box" },
  { label: "Slice", value: "slice" },
  { label: "Portion", value: "portion" },
  { label: "Set", value: "set" },
]

export type CreateStockInput = StockFormValue

export type UpdateStockInput = StockFormValue

export async function getStocks(
  params?: StockQueryParams
): Promise<StockListResponse> {
  const res = await axiosClient.get<StockListResponse>("/inventories", { params })
  return res.data
}

export async function createStock (input: CreateStockInput) {
  const res = await axiosClient.post("/inventories", input)
  return res.data
}

export async function updateStock(id: string, input: UpdateStockInput) {
  const res = await axiosClient.put(`/inventories/${id}`, input)
  return res.data
}

export async function deleteStock(id: string) {
  const res = await axiosClient.delete(`/inventories/${id}`)
  return res.data
}

export async function getCountStatus() {
  const res = await axiosClient.get<StatusListResponse>("/inventories/count-by-status")
  return res.data
}