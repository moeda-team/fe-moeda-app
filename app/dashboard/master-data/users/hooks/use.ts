import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  type UsersQueryParams,
  type UsersListResponse,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/lib/api/users/req-api"

const usersKey = (params?: UsersQueryParams) => ["users", params ?? {}] as const

export function useUsersQuery(params?: UsersQueryParams) {
  return useQuery<UsersListResponse>({
    queryKey: usersKey(params),
    queryFn: () => getUsers(params),
  })
}

// create/update/delete tetap sama (invalidate ["users"])
export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) =>
      updateUser(id, input),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["users"] })
    },
  })
}
