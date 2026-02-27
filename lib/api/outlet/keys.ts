export const stocksKeys = {
  all: ["stocks"] as const,
  lists: () => [...stocksKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...stocksKeys.lists(), params ?? {}] as const,
  details: () => [...stocksKeys.all, "detail"] as const,
  detail: (id: string) => [...stocksKeys.details(), id] as const,
}
