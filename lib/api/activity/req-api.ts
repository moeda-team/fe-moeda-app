import { axiosClient } from "../axios-client"
import { StockItem } from "../inventory/req-api"

export type ActivityItem = {
  id: string
  inventoryId: string
  inventory: StockItem
  user: {
    name :string
  }
  type: string
  quantity: number
  notes: string
  note: string
  updatedAt: string
}

export type ActivityFormValue = {
  inventoryId: string,
  type: string,
  quantity: number,
  notes: string
}

export type ActivityQueryParams = {
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

export type ActivityListResponse = {
  statusCode: number
  additional: unknown
  data: ActivityItem[]
  pagination: Paginate
}

export type StatusListResponse = {
  data : {
    SAFE: number
    LOW: number
    OUT: number
    total: number
  }
}

export type CreateActivityInput = ActivityFormValue

export type UpdateActivityInput = ActivityFormValue

export async function getActivities(
  params?: ActivityQueryParams
): Promise<ActivityListResponse> {
  const res = await axiosClient.get<ActivityListResponse>("/inventories/activities", { params })
  return res.data
}

export async function createActivity (input: CreateActivityInput) {
  const res = await axiosClient.post("/inventories/activities", input)
  return res.data
}

export async function updateActivity(id: string, input: UpdateActivityInput) {
  const res = await axiosClient.put(`/inventories/activities/${id}`, input)
  return res.data
}

export async function deleteActivity(id: string) {
  const res = await axiosClient.delete(`/inventories/activities/${id}`)
  return res.data
}

export async function getCountStatus() {
  const res = await axiosClient.get<StatusListResponse>("/inventories/activities/count-by-status")
  return res.data
}