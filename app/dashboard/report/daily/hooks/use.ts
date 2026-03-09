import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getReport,
  createReport,
  updateReport,
  deleteReport,
  type ReportQueryParams,
  type ReportListResponse,
  type CreateReportInput,
  type UpdateReportInput,
  getTopSelling,
  TopSellingResponse,
  getTopSales,
  SalesResponse,
  getReportDaily,
  getReportDetailDaily,
} from "@/lib/api/report/req-api"

const ReportKey = (params?: ReportQueryParams) => ["report", params ?? {}] as const

export function useReportQuery(params?: ReportQueryParams) {
  return useQuery<ReportListResponse>({
    queryKey: ReportKey(params),
    queryFn: () => getReport(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateReportInput) => createReport(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["report"] })
    },
  })
}

export function useUpdateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateReportInput }) =>
      updateReport(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["report"] })
    },
  })
}

export function useDeleteReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteReport(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["report"] })
    },
  })
}

export function useTopSelling(params?: ReportQueryParams) {
  return useQuery<TopSellingResponse>({
    queryKey: ["top-selling"],
    queryFn: () => getTopSelling(params),
  })
}

export function useSales(params?: ReportQueryParams) {
  return useQuery<SalesResponse>({
    queryKey: ["sales"],
    queryFn: () => getTopSales(params),
  })
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: (date: string) => getReportDaily({ date }),

    onSuccess: (res, date) => {
      const blob = new Blob([res])

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = `Report Daily -${date}.xlsx`
      a.click()

      window.URL.revokeObjectURL(url)
    },
  })
}
export function useDownloadDetailReport() {
  return useMutation({
    mutationFn: (params: { cashBookId: string; date: string; filename: string }) => getReportDetailDaily(params.cashBookId),

    onSuccess: (res, params) => {
      const blob = new Blob([res])

      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = params.filename
      a.click()

      window.URL.revokeObjectURL(url)
    },
  })
}