import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCategories,
  createCategories,
  updateCategories,
  deleteCategories,
  type CategoriesQueryParams,
  type CategoriesListResponse,
  type CreateCategoriesInput,
  type UpdateCategoriesInput,
} from "@/lib/api/categories/req-api"

const categoriesKey = (params?: CategoriesQueryParams) => ["categories", params ?? {}] as const

export function useCategoriesQuery(params?: CategoriesQueryParams) {
  return useQuery<CategoriesListResponse>({
    queryKey: categoriesKey(params),
    queryFn: () => getCategories(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCategoriesInput) => createCategories(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useUpdateCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoriesInput }) =>
      updateCategories(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}

export function useDeleteCategories() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategories(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["categories"] })
    },
  })
}
