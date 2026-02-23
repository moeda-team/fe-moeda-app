export const tablesKeys = {
  all: ["tables"] as const,
  lists: () => [...tablesKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...tablesKeys.lists(), params ?? {}] as const,
  details: () => [...tablesKeys.all, "detail"] as const,
  detail: (id: string) => [...tablesKeys.details(), id] as const,
}
