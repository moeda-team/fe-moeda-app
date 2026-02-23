export const vouchersKeys = {
  all: ["vouchers"] as const,
  lists: () => [...vouchersKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...vouchersKeys.lists(), params ?? {}] as const,
  details: () => [...vouchersKeys.all, "detail"] as const,
  detail: (id: string) => [...vouchersKeys.details(), id] as const,
}
