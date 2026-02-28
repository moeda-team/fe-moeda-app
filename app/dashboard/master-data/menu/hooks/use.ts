import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu,
  type MenuQueryParams,
  type MenuListResponse,
  type CreateMenuInput,
  type UpdateMenuInput,
  updateMenuOption,
  deleteBestMenu,
  createMenuBest,
  updateMenuIngredient,
  MenuIngredientForm,
} from "@/lib/api/menu/req-api"
import { MenuFormValueOptions } from "@/lib/option-utils"

const MenuKey = (params?: MenuQueryParams) => ["menu", params ?? {}] as const

export function useMenuQuery(params?: MenuQueryParams) {
  return useQuery<MenuListResponse>({
    queryKey: MenuKey(params),
    queryFn: () => getMenus(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateMenuInput) => createMenu(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export function useUpdateMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMenuInput }) =>
      updateMenu(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export function useDeleteMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteMenu(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export function useUpdateMenuOption() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MenuFormValueOptions) => updateMenuOption(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export function useUpdateMenuIngredient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MenuIngredientForm) => updateMenuIngredient(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export function useCreateBestMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: {menuId: string, order: number}) => createMenuBest(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}

export function useDeleteBestMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteBestMenu(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["menu"] })
    },
  })
}