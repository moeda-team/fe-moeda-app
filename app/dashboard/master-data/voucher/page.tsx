"use client"

import * as React from "react"
import {
  useVouchersQuery,
  useCreateVoucher,
  useUpdateVoucher,
  useDeleteVoucher,
} from "@/app/dashboard/master-data/voucher/hooks/use"
import type { UpdateVouchersInput, VoucherFormValue, VouchersItem } from "@/lib/api/voucher/req-api"

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
import { VoucherFormDialog } from "@/components/dialog/form-voucher"
import { formatDate } from "date-fns"
import { formatCurrency } from "@/lib/helpers"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

const emptyForm: VoucherFormValue = {
  name: "",
  type: "",
  discount: 0,
  maxUsage: 0,
  expiredAt: "",
  allMenu: true,
}

export default function VouchersPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedVoucher, setSelectedVoucher] = React.useState<VouchersItem | null>(null)

  /** data */
  const { data, isLoading } = useVouchersQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateVoucher()
  const updateMut = useUpdateVoucher()
  const deleteMut = useDeleteVoucher()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<VouchersItem | null>(null)
  const [form, setForm] = React.useState<VoucherFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: VouchersItem) => {
    setEditing(u)
    setForm({
      name: u.name ?? "",
      type: u.type ?? "",
      discount: u.discount ?? 0,
      maxUsage: u.maxUsage ?? 0,
      expiredAt: formatDate(u.expiredAt ?? "", "yyyy-MM-dd") ?? "",
      allMenu: false,
    })
    setOpen(true)
  }

  const onSubmit = async (data: VoucherFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          type: data.type,
          discount: data.discount,
          maxUsage: data.maxUsage,
          expiredAt: data.expiredAt,
          allMenu: data.allMenu,
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateVouchersInput })
        toast.success("Voucher berhasil diperbarui")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Voucher berhasil dibuat")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedVoucher) return

    try {
      await deleteMut.mutateAsync(selectedVoucher.id??"")
      toast.success(`Voucher "${selectedVoucher.name}" dihapus`)
      setConfirmOpen(false)
      setSelectedVoucher(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const vouchers = data?.data ?? []
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
          <h1 className="text-2xl font-semibold">Voucher</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading} className="dark:text-white">
              Create Voucher
            </Button>
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Max Usage</TableHead>
                <TableHead>Expired At</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                vouchers.map((v) => (
                  <TableRow key={v.id} className={v.expiredAt < new Date().toISOString() ? "hover:bg-accent" : ""}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>
                      {v.type === "fixed" ? formatCurrency(v.discount) : `${v.discount}%`}
                    </TableCell>
                    <TableCell>{v.maxUsage}</TableCell>
                    <TableCell>{formatDate(v.expiredAt, "dd MMMM yyyy")}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(v)}
                        disabled={fullscreenLoading}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedVoucher(v)
                          setConfirmOpen(true)
                        }}
                        disabled={fullscreenLoading}
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
        <VoucherFormDialog
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
          title="Delete voucher?"
          description={
            <>
              Voucher <b>{selectedVoucher?.name}</b> akan dihapus permanen.
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
