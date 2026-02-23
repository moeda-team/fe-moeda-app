export const discountsKeys = {
  all: ["discounts"] as const,
  lists: () => [...discountsKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...discountsKeys.lists(), params ?? {}] as const,
  details: () => [...discountsKeys.all, "detail"] as const,
  detail: (id: string) => [...discountsKeys.details(), id] as const,
}
