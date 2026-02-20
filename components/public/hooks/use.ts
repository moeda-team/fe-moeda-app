import { useQuery } from "@tanstack/react-query"
import { OUTLET_ID } from "@/services"
import {
  CategoryListResponse,
  CategoryQueryParams,
  getCategories,
} from "@/lib/api/customer/req-api"

import {
  MenuListResponse,
  MenuQueryParams,
  getMenus,
} from "@/lib/api/menu/req-api"

/* =========================
   QUERY KEYS
========================= */

const categoriesKey = (params?: CategoryQueryParams) =>
  ["categories", OUTLET_ID, params ?? {}] as const

const menuKey = (params?: MenuQueryParams) =>
  ["menus", OUTLET_ID, params ?? {}] as const

/* =========================
   HOOKS
========================= */

export function useCategoriesQuery(params?: CategoryQueryParams) {
  return useQuery<CategoryListResponse>({
    queryKey: categoriesKey(params),
    queryFn: () => getCategories(OUTLET_ID, params),
  })
}

export function useMenuQuery(params?: MenuQueryParams) {
  return useQuery<MenuListResponse>({
    queryKey: menuKey(params),
    queryFn: () => getMenus(OUTLET_ID, params),
  })
}
