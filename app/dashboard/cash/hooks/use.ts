import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCashBalance,
  createCashBalance,
  updateCashBalance,
  deleteCashBalance,
  type CashBalanceQueryParams,
  type CashBalanceListResponse,
  type CreateCashBalanceInput,
  type UpdateCashBalanceInput,
  getCashBalanceDetail,
} from "@/lib/api/cash-balance/req-api"

const cashBalanceKey = (params?: CashBalanceQueryParams) => ["cash-balance", params ?? {}] as const

export function useCashBalanceQuery(params?: CashBalanceQueryParams) {
  return useQuery<CashBalanceListResponse>({
    queryKey: cashBalanceKey(params),
    queryFn: () => getCashBalance(params),
  })
}
export function useCashBalanceDetailQuery(params?: CashBalanceQueryParams) {
  return useQuery<CashBalanceListResponse>({
    queryKey: ['cash-balance'],
    queryFn: () => getCashBalanceDetail(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateCashBalance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateCashBalanceInput) => createCashBalance(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cash-balance"] })
    },
  })
}

export function useUpdateCashBalance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCashBalanceInput }) =>
      updateCashBalance(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cash-balance"] })
    },
  })
}

export function useDeleteCashBalance() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCashBalance(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cash-balance"] })
    },
  })
}