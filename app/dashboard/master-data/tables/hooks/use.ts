import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  type TablesQueryParams,
  type TablesListResponse,
  type CreateTablesInput,
  type UpdateTablesInput,
} from "@/lib/api/tables/req-api"

const tablesKey = (params?: TablesQueryParams) => ["tables", params ?? {}] as const

export function useTablesQuery(params?: TablesQueryParams) {
  return useQuery<TablesListResponse>({
    queryKey: tablesKey(params),
    queryFn: () => getTables(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateTablesInput) => createTable(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tables"] })
    },
  })
}

export function useUpdateTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTablesInput }) =>
      updateTable(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["discounts"] })
    },
  })
}

export function useDeleteTable() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteTable(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["tables"] })
    },
  })
}