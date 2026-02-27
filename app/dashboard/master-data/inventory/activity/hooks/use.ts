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

const stockKey = (params?: StockQueryParams) => ["stocks", params ?? {}] as const

export function useStocksQuery(params?: StockQueryParams) {
  return useQuery<StockListResponse>({
    queryKey: stockKey(params),
    queryFn: () => getStocks(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateStockInput) => createStock(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["stocks"] })
    },
  })
}

export function useUpdateStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStockInput }) =>
      updateStock(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["stocks"] })
    },
  })
}

export function useDeleteStock() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteStock(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["stocks"] })
    },
  })
}

export function useCountStocks() {
  return useQuery({
    queryKey: ["countStocks"],
    queryFn: () => getCountStatus(),
  })
}