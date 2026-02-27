export const activitiesKeys = {
  all: ["activities"] as const,
  lists: () => [...activitiesKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...activitiesKeys.lists(), params ?? {}] as const,
  details: () => [...activitiesKeys.all, "detail"] as const,
  detail: (id: string) => [...activitiesKeys.details(), id] as const,
}
