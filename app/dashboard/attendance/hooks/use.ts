import { useQuery } from "@tanstack/react-query"
import {
  getAttendance,
  UsersQueryParams,
  AttendanceListResponse,
} from "@/lib/api/users/req-api"

const attendanceKey = (params?: UsersQueryParams) => ["attendance", params ?? {}] as const

export function useAttendanceQuery(params?: UsersQueryParams) {
  return useQuery<AttendanceListResponse>({
    queryKey: attendanceKey(params),
    queryFn: () => getAttendance(params),
  })
}