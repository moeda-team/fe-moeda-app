import { axiosClient } from "../axios-client"

export type TablesItem = {
  id?: string,
  name: string,
  outletId: string,
}

export type TableFormValue = {
  name : string,
  outletId : string,
}

export type TablesQueryParams = {
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

export type TablesListResponse = {
  statusCode: number
  additional: unknown
  data: TablesItem[]
  pagination: Paginate
}

export type CreateTablesInput = TableFormValue

export type UpdateTablesInput = TableFormValue

export async function getTables(
  params?: TablesQueryParams
): Promise<TablesListResponse> {
  const res = await axiosClient.get<TablesListResponse>("/tables", { params })
  return res.data
}

export async function createTable (input: CreateTablesInput) {
  const res = await axiosClient.post("/tables", input)
  return res.data
}

export async function updateTable(id: string, input: UpdateTablesInput) {
  const res = await axiosClient.put(`/tables/${id}`, input)
  return res.data
}

export async function deleteTable(id: string) {
  const res = await axiosClient.delete(`/tables/${id}`)
  return res.data
}

export async function switchTable(input: {fromTable: string, tableId: string, note?: string}) {
  const res = await axiosClient.patch(`/transactions/main/table/${input.fromTable}`, input)
  return res.data
}
