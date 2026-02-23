import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getDiscounts,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  updateDiscountMenu,
  type DiscountsQueryParams,
  type DiscountsListResponse,
  type CreateDiscountsInput,
  type UpdateDiscountsInput,
  type UpdateDiscountsInputMenu,
} from "@/lib/api/discounts/req-api"

const discountsKey = (params?: DiscountsQueryParams) => ["discounts", params ?? {}] as const

export function useDiscountsQuery(params?: DiscountsQueryParams) {
  return useQuery<DiscountsListResponse>({
    queryKey: discountsKey(params),
    queryFn: () => getDiscounts(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateDiscountsInput) => createDiscount(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["discounts"] })
    },
  })
}

export function useUpdateDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDiscountsInput }) =>
      updateDiscount(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["discounts"] })
    },
  })
}

export function useDeleteDiscount() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["discounts"] })
    },
  })
}

export function useUpdateDiscountMenu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateDiscountsInputMenu) =>
      updateDiscountMenu(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["discounts"] })
    },
  })
}