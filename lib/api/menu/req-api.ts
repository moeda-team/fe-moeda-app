import { MenuFormValueOptions } from "@/lib/option-utils"
import { axiosClient } from "../axios-client"
import { MenuOption } from "../customer/req-api"
import { Paginate } from "../users/req-api"

// menu
export type Menuitem = {
  id: string,
  outletId: string,
  name: string,
  desc: string,
  img: string,
  price: string,
  options: MenuOption[],
  pdf: string,
  categoryId: string,
  isNew: boolean,
  isBest: boolean,
  quantity: number,
  isActive: boolean,
  createdAt: string,
  updatedAt: string
  vouchers: Voucher[],
  discountMenus: DiscountMenu[]
  bestSellerMenus : BestSellerMenu[]
}

export type BestSellerMenu = 
{
  id: string,
  menuId: string,
  order: number,
}

export type MenuForm = {
  categoryId : string,
  name : string,
  desc : string,
  img : string,
  price : number,
}

export type MenuitemBestseller = {
  id: string,
  menuId: string,
  menu: Menuitem,
  order: number
}

export type Voucher = {
  voucherId: string,
  voucher: {
      name: string,
      discount: string,
      type: string,
      maxUsage: string
  }
}

export type DiscountMenu = 
{
  discountId: string,
  discount: {
      name: string,
      discount: string,
      type: string,
      maxUsage: string
  }
}

export type MenuQueryParams = {
  search?: string
  page?: number
  perPage?: number
  category?: string
  best?: boolean
}

export type MenuListResponse = {
  statusCode: number
  additional: unknown
  data: Menuitem[]
  paginate: Paginate
}

export type MenuBestsellerResponse = {
  statusCode: number
  additional: unknown
  data: MenuitemBestseller[]
  paginate: Paginate
}

export async function getMenus(
  params?: MenuQueryParams
): Promise<MenuListResponse> {
  const res = await axiosClient.get<MenuListResponse>(`/menus/main`, { params })
  return res.data
}

export async function getBestseller(
  params?: MenuQueryParams
): Promise<MenuBestsellerResponse> {
  const res = await axiosClient.get<MenuBestsellerResponse>(`/menus/best-seller`, { params })
  return res.data
}

export type MenuFormValue = {
  name : string,
  outletId : string,
}

export type OptionsListResponse = {
  statusCode: number
  additional: unknown
  data: Menuitem[]
  paginate: Paginate
}

export type CreateMenuInput = MenuForm

export type UpdateMenuInput = MenuForm

export async function createMenu (input: CreateMenuInput) {
  const res = await axiosClient.post("/menus/main", input)
  return res.data
}

export async function updateMenu(id: string, input: UpdateMenuInput) {
  const res = await axiosClient.put(`/menus/main/${id}`, input)
  return res.data
}

export async function deleteMenu(id: string) {
  const res = await axiosClient.delete(`/menus/main/${id}`)
  return res.data
}

export async function updateMenuOption (input: MenuFormValueOptions) {
  const res = await axiosClient.post("/menus/options", input)
  return res.data
}

export async function createMenuBest (input: {menuId: string, order: number}) {
  const res = await axiosClient.post("/menus/best-seller", input)
  return res.data
}

export async function deleteBestMenu(id: string) {
  const res = await axiosClient.delete(`/menus/best-seller/${id}`)
  return res.data
}