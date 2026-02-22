import { useQuery } from "@tanstack/react-query"
import {
  CategoryListResponse,
  CategoryQueryParams,
  getCategories,
} from "@/lib/api/customer/req-api"

import {
  MenuBestsellerResponse,
  MenuListResponse,
  MenuQueryParams,
  getBestseller,
  getMenus,
} from "@/lib/api/menu/req-api"

/* =========================
   QUERY KEYS
========================= */

const categoriesKey = (params?: CategoryQueryParams) =>
  ["categories", params ?? {}] as const

const bestsellerKey = (params?: CategoryQueryParams) =>
  ["bestseller", params ?? {}] as const

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

export function useBestsellerQuery(params?: MenuQueryParams) {
  return useQuery<MenuBestsellerResponse>({
    queryKey: bestsellerKey(params),
    queryFn: () => getBestseller(params),
  })
}
