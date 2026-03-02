export const reportKeys = {
  all: ["report"] as const,
  lists: () => [...reportKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...reportKeys.lists(), params ?? {}] as const,
  details: () => [...reportKeys.all, "detail"] as const,
  detail: (id: string) => [...reportKeys.details(), id] as const,
}
