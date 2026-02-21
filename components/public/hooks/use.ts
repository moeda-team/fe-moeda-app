import { useQuery } from "@tanstack/react-query"
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
  ["categories", params ?? {}] as const

const menuKey = (params?: MenuQueryParams) =>
  ["menus", params ?? {}] as const

/* =========================
   HOOKS
========================= */

export function useCategoriesQuery(params?: CategoryQueryParams) {
  return useQuery<CategoryListResponse>({
    queryKey: categoriesKey(params),
    queryFn: () => getCategories(params),
  })
}

export function useMenuQuery(params?: MenuQueryParams) {
  return useQuery<MenuListResponse>({
    queryKey: menuKey(params),
    queryFn: () => getMenus(params),
  })
}
