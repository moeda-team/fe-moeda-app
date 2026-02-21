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
  vouchers: Voucher[]
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

export type MenuQueryParams = {
  search?: string
  category?: string
  best?: boolean
}

export type MenuListResponse = {
  statusCode: number
  additional: unknown
  data: Menuitem[]
  paginate: Paginate
}

export async function getMenus(
  params?: MenuQueryParams
): Promise<MenuListResponse> {
  const res = await axiosClient.get<MenuListResponse>(`/menus/main`, { params })
  return res.data
}
