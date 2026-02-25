import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTransactionsActive,
  type TransactionsQueryParams,
  type TransactionsListResponse,
  type UpdateTransactionsInput,
  updateTransaction,
} from "@/lib/api/transactions/req-api"

const transactionsKey = (params?: TransactionsQueryParams) => ["transactions", params ?? {}] as const

export function useTransactionsQuery(params?: TransactionsQueryParams) {
  return useQuery<TransactionsListResponse>({
    queryKey: transactionsKey(params),
    queryFn: () => getTransactionsActive(params),
  })
}
export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTransactionsInput }) =>
      updateTransaction(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}
