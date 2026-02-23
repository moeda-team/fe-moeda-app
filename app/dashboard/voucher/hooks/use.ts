import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  type VouchersQueryParams,
  type VouchersListResponse,
  type CreateVouchersInput,
  type UpdateVouchersInput,
} from "@/lib/api/voucher/req-api"

const vouchersKey = (params?: VouchersQueryParams) => ["vouchers", params ?? {}] as const

export function useVouchersQuery(params?: VouchersQueryParams) {
  return useQuery<VouchersListResponse>({
    queryKey: vouchersKey(params),
    queryFn: () => getVouchers(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateVouchersInput) => createVoucher(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vouchers"] })
    },
  })
}

export function useUpdateVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVouchersInput }) =>
      updateVoucher(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vouchers"] })
    },
  })
}

export function useDeleteVoucher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteVoucher(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vouchers"] })
    },
  })
}
