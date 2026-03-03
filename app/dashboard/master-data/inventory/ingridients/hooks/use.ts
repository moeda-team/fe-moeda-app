import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getStocks,
  createStock,
  updateStock,
  deleteStock,
  getCountStatus,
  type StockQueryParams,
  type StockListResponse,
  type CreateStockInput,
  type UpdateStockInput,
} from "@/lib/api/inventory/req-api"

/* ======================================================
   Query Key Factory
====================================================== */

export const stockKeys = {
  all: ["stocks"] as const,
  lists: (params?: StockQueryParams) =>
    ["stocks", params ?? {}] as const,
  count: ["stock-count"] as const,
}

/* ======================================================
   Queries
====================================================== */

export function useCountStocks() {
  return useQuery({
    queryKey: stockKeys.count,
    queryFn: getCountStatus,
  })
}

export function useStocksQuery(params?: StockQueryParams) {
  return useQuery<StockListResponse>({
    queryKey: stockKeys.lists(params),
    queryFn: () => getStocks(params),
  })
}

/* ======================================================
   Mutations
====================================================== */

export function useCreateStock() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateStockInput) => createStock(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: stockKeys.all })
      await qc.invalidateQueries({ queryKey: stockKeys.count })
    },
  })
}

export function useUpdateStock() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStockInput }) =>
      updateStock(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: stockKeys.all })
      await qc.invalidateQueries({ queryKey: stockKeys.count })
    },
  })
}

export function useDeleteStock() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteStock(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: stockKeys.all })
      await qc.invalidateQueries({ queryKey: stockKeys.count })
    },
  })
}