import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getCurrentUser,
  updateCurrentUser,
  type UpdateProfileInput,
  type UserProfile,
} from "@/lib/api/user-profile/req-api"
import { ResponseData } from "@/lib/api/response-data"

const currentUserKey = (id: string) => ["current-user", id] as const

export function useUserQuery(id: string) {
  return useQuery<ResponseData<UserProfile>>({
    queryKey: currentUserKey(id),
    queryFn: () => getCurrentUser(id),
    enabled: !!id, // Only run query if id exists
  })
}

export function useUpdateUser(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => updateCurrentUser(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: currentUserKey(id) })
    },
  })
}
