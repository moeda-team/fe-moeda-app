import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createOutlet,
  updateOutlet,
  deleteOutlet,
  type OutletQueryParams,
  type OutletListResponse,
  type CreateOutletInput,
  type UpdateOutletInput,
  getOutlets,
} from "@/lib/api/outlet/req-api"

const tablesKey = (params?: OutletQueryParams) => ["outlets", params ?? {}] as const

export function useOutletsQuery(params?: OutletQueryParams) {
  return useQuery<OutletListResponse>({
    queryKey: tablesKey(params),
    queryFn: () => getOutlets(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateOutlet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateOutletInput) => createOutlet(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["outlets"] })
    },
  })
}

export function useUpdateOutlet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateOutletInput }) =>
      updateOutlet(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["outlets"] })
    },
  })
}

export function useDeleteOutlet() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteOutlet(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["outlets"] })
    },
  })
}