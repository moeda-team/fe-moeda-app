import { useQuery } from "@tanstack/react-query"
import {
  type ReportQueryParams,
  ReportSessionDetailResponse,
  type ReportSessionListResponse,
  getDetailReportSession,
  getReportSession,
} from "@/lib/api/report/req-api"

const ReportSessionKey = (params?: ReportQueryParams) => ["report-session", params ?? {}] as const

export function useReportSessionQuery(params?: ReportQueryParams) {
  return useQuery<ReportSessionListResponse>({
    queryKey: ReportSessionKey(params),
    queryFn: () => getReportSession(params),
  })
}

export function useDetailReportSessionQuery(id:string) {
  return useQuery<ReportSessionDetailResponse>({
    queryKey: ['report detail'],
    queryFn: () => getDetailReportSession(id),
  })
}
