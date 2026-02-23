import { axiosClient } from "../axios-client"
import { Menuitem } from "../menu/req-api"

export type DiscountsItem = {
  id?: string,
  name: string,
  type: string,
  discount: number,
  maxUsage: number,
  expiredAt: string,
  allMenu : boolean,
  discountMenus : {
    discountId : string,
    menuId : number    
    menu : Menuitem,
  }[]
}

export type DiscountFormValue = {
  name : string,
  type : string,
  discount : number,
  maxUsage : number,
  expiredAt : string,
  allMenu : boolean,
}

export type DiscountsQueryParams = {
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

export type DiscountsListResponse = {
  statusCode: number
  additional: unknown
  data: DiscountsItem[]
  paginate: Paginate
}

export type CreateDiscountsInput = DiscountFormValue

export type UpdateDiscountsInput = DiscountFormValue

export type UpdateDiscountsInputMenu = {
  discountId: string,
  menuId: string[]
}

export async function getDiscounts(
  params?: DiscountsQueryParams
): Promise<DiscountsListResponse> {
  const res = await axiosClient.get<DiscountsListResponse>("/discounts", { params })
  return res.data
}

export async function createDiscount (input: CreateDiscountsInput) {
  const res = await axiosClient.post("/discounts", input)
  return res.data
}

export async function updateDiscount(id: string, input: UpdateDiscountsInput) {
  const res = await axiosClient.put(`/discounts/${id}`, input)
  return res.data
}

export async function deleteDiscount(id: string) {
  const res = await axiosClient.delete(`/discounts/${id}`)
  return res.data
}

export async function updateDiscountMenu(input: UpdateDiscountsInputMenu) {
  const res = await axiosClient.post(`/discounts/menus`, input)
  return res.data
}