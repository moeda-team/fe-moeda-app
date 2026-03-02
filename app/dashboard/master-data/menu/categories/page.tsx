"use client"

import * as React from "react"
import {
  useCategoriesQuery,
  useCreateCategories,
  useUpdateCategories,
  useDeleteCategories,
} from "@/app/dashboard/master-data/menu/categories/hooks/use"
import type { UpdateCategoriesInput, CategoriesItem, CategoriesFormValue } from "@/lib/api/categories/req-api"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { AppPagination } from "@/components/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { LoadingOverlay } from "@/components/ui/loading"

import { toast } from "sonner"
import { getErrorMessage } from "@/lib/toast-error"
import { useDebounce } from "@/components/use-debounce"
import { ConfirmDialog } from "@/components/dialog/confirm-dialog"
import { CategoriesFormDialog } from "@/components/dialog/form-categories"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

const emptyForm: CategoriesFormValue = {
  name: "",
  icon: "",
}

export default function CategoriesPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<CategoriesItem | null>(null)

  /** data */
  const { data, isLoading } = useCategoriesQuery({
    page,
    limit: perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateCategories()
  const updateMut = useUpdateCategories()
  const deleteMut = useDeleteCategories()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<CategoriesItem | null>(null)
  const [form, setForm] = React.useState<CategoriesFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: CategoriesItem) => {
    setEditing(u)

    setForm({
      name: u.name ?? "",
      icon: u.icon ?? "",
    })
    setOpen(true)
  }

  const onSubmit = async (data: CategoriesFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          icon: data.icon,
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateCategoriesInput })
        toast.success(`Category "${editing.name}" berhasil diperbarui`)
      } else {
        await createMut.mutateAsync(data)
        toast.success(`Category "${data.name}" berhasil dibuat`)
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedCategory) return

    try {
      await deleteMut.mutateAsync(selectedCategory.id??"")
      toast.success(`Category "${selectedCategory.name}" deleted`)
      setConfirmOpen(false)
      setSelectedCategory(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const categories = data?.data ?? []
  const total = data?.pagination?.total

  /** overlays */
  const tableLoading = isLoading
  const fullscreenLoading = createMut.isPending || updateMut.isPending || deleteMut.isPending


  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={fullscreenLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Categories</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading} className="dark:text-white">
              Create Category
            </Button>
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div><img src={v.icon} alt={v.name} className="w-10 h-10 rounded-full" /></div>
                        <div>{v.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(v)}
                        disabled={fullscreenLoading}
                        className="dark:text-white"
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedCategory(v)
                          setConfirmOpen(true)
                        }}
                        disabled={fullscreenLoading}
                        className="dark:text-white"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination + PerPage */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between w-full">
          <div className="flex items-center gap-2 text-sm">
            <Select
              value={String(perPage)}
              onValueChange={(v) => {
                setPerPage(Number(v))
                setPage(1)
              }}
              disabled={fullscreenLoading}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PER_PAGE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AppPagination
            page={page}
            pageSize={perPage}
            total={total}
            onPageChange={setPage}
          />
        </div>

        {/* Form dialog */}
        <CategoriesFormDialog
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          value={form}
          onChange={setForm}
          onSubmit={(data) => {
            onSubmit(data)
          }}
          loading={createMut.isPending || updateMut.isPending}
        />

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete category?"
          description={
            <>
              Category <b>{selectedCategory?.name}</b> akan dihapus permanen.
            </>
          }
          confirmText="Delete"
          confirmVariant="destructive"
          loading={deleteMut.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </DashboardLayout>
  )
}
