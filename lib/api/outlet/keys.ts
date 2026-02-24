export const outletsKeys = {
  all: ["outlets"] as const,
  lists: () => [...outletsKeys.all, "list"] as const,
  list: (params?: { q?: string; page?: number; limit?: number }) =>
    [...outletsKeys.lists(), params ?? {}] as const,
  details: () => [...outletsKeys.all, "detail"] as const,
  detail: (id: string) => [...outletsKeys.details(), id] as const,
}
