import { MenuFormValueOptions } from "@/lib/option-utils"
import { axiosClient } from "../axios-client"
import { MenuOption } from "../customer/req-api"
import { Paginate } from "../users/req-api"
import { StockItem } from "../inventory/req-api"

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
  isAvailable: boolean,
  createdAt: string,
  updatedAt: string
  vouchers: Voucher[],
  discountMenus: DiscountMenu[]
  bestSellerMenus : BestSellerMenu[]
  menuIngredients :MenuIngredient[]
}

export type MenuIngredient = {
  id: string,
  menuId: string,
  ingredientId: string,
  quantity: number,
  status: string,
  unit: string,
  ingredient: StockItem
}

export type MenuIngredientForm = {
  menuId: string,
  ingredients: IngredientForm[],
}
export type IngredientForm = {
  ingredientId: string,
  quantity: number,
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
  limit?: number
  category?: string
  best?: boolean
}

export type ListResponse = {
  statusCode: number
  additional: unknown
  data: Menuitem[]
  pagination: Paginate
}

export type MenuBestsellerResponse = {
  statusCode: number
  additional: unknown
  data: MenuitemBestseller[]
  pagination: Paginate
}

export async function getMenus(
  params?: MenuQueryParams
): Promise<ListResponse> {
  const res = await axiosClient.get<ListResponse>(`/menus/main`, { params })
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
  pagination: Paginate
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

export async function updateMenuIngredient (input: MenuIngredientForm) {
  const res = await axiosClient.put("/menus/main/ingredients", input)
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