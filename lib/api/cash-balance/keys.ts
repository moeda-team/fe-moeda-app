export const cashBalanceKeys = {
  all: ["cashBalance"] as const,
  lists: () => [...cashBalanceKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...cashBalanceKeys.lists(), params ?? {}] as const,
  details: () => [...cashBalanceKeys.all, "detail"] as const,
  detail: (id: string) => [...cashBalanceKeys.details(), id] as const,
}
