import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getCountStatus,
  type ActivityQueryParams,
  type ActivityListResponse,
  type CreateActivityInput,
  type UpdateActivityInput,
} from "@/lib/api/activity/req-api"

const activityKey = (params?: ActivityQueryParams) => ["activities", params ?? {}] as const

export function useActivitiesQuery(params?: ActivityQueryParams) {
  return useQuery<ActivityListResponse>({
    queryKey: activityKey(params),
    queryFn: () => getActivities(params),
  })
}

// create/update/delete tetap sama (invalidate ["vouchers"])
export function useCreateActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateActivityInput) => createActivity(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["activities"] })
      await qc.invalidateQueries({ queryKey: ["countActivities"] })
    },
  })
}

export function useUpdateActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateActivityInput }) =>
      updateActivity(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["activities"] })
      await qc.invalidateQueries({ queryKey: ["countActivities"] })
    },
  })
}

export function useDeleteActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteActivity(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["activities"] })
      await qc.invalidateQueries({ queryKey: ["countActivities"] })
    },
  })
}

export function useCountActivities() {
  return useQuery({
    queryKey: ["countActivities"],
    queryFn: () => getCountStatus(),
  })
}