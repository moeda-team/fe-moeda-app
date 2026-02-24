export const optionsKeys = {
  all: ["options"] as const,
  lists: () => [...optionsKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...optionsKeys.lists(), params ?? {}] as const,
  details: () => [...optionsKeys.all, "detail"] as const,
  detail: (id: string) => [...optionsKeys.details(), id] as const,
}
