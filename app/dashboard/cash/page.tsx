"use client"

import * as React from "react"
import {
  useCashBalanceQuery,
  useCreateCashBalance,
  useUpdateCashBalance,
  useDeleteCashBalance,
  useCashBalanceDetailQuery,
} from "@/app/dashboard/cash/hooks/use"
import type { UpdateCashBalanceInput, CashBalanceFormValue, CashBalanceItem } from "@/lib/api/cash-balance/req-api"

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
import { formatCurrency } from "@/lib/helpers"
import { X } from "lucide-react"
import { CashBalanceFormDialog } from "@/components/dialog/form-cash"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

const emptyForm: CashBalanceFormValue = {
  amount: 0,
  type: "ADD",
  description: "",
}

export default function CashBalancePage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedCashBalance, setSelectedCashBalance] = React.useState<CashBalanceItem | null>(null)

  /** data */
  const { data, isLoading } = useCashBalanceQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
  })

  const { data:detail } = useCashBalanceDetailQuery()

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateCashBalance()
  const updateMut = useUpdateCashBalance()
  const deleteMut = useDeleteCashBalance()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<CashBalanceItem | null>(null)
  const [form, setForm] = React.useState<CashBalanceFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: CashBalanceItem) => {
    setEditing(u)

    setForm({
      amount: u.amount,
      type: u.type,
      description: u.description ?? "",
    })
    setOpen(true)
  }

  const onSubmit = async (data: CashBalanceFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          amount: data.amount,
          type: data.type,
          description: data.description,
          cancelNote: data.cancelNote,
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateCashBalanceInput })
        toast.success("Cash berhasil diperbarui")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Cash berhasil dibuat")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedCashBalance) return

    try {
      await deleteMut.mutateAsync(selectedCashBalance.id??"")
      toast.success(`Cash dihapus`)
      setConfirmOpen(false)
      setSelectedCashBalance(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const listData = data?.data ?? []
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
          <h1 className="text-2xl font-semibold">Cash / Balance Logs</h1>

          <div className="flex gap-2">
            {detail && detail?.data.length > 0 && (
              <div className="flex gap-3 justify-end ">
                <div className="text-sm font-semibold p-2 border border-primary rounded-lg bg-primary/20 w-full">
                  <div className="font-medium">
                    Current Balance :  {formatCurrency(detail.data.reduce((sum, item) => sum + item.amount, 0))}
                  </div>
                </div>
              </div>
            )}
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading} className="dark:text-white">
              New Cash / Balance
            </Button>
          </div>
        </div>
        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Prev Amount</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && listData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                listData.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.description ?? "-"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(v.previousAmount)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(v.amount)}</TableCell>
                    <TableCell className="font-medium capitalize">
                      <div className={`${v.status === "cancelled" ? "text-red-500" : "text-green-500"}`}>{v.status}</div>
                      <div className="text-xs text-muted-foreground">{v.cancelNote}</div>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openEdit(v)}
                        title="Cancel"
                        className={`${v.status === "cancelled" ? "hidden" : "block"} dark:text-white`}
                        disabled={fullscreenLoading}
                      >
                        <X />
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
        <CashBalanceFormDialog
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
          title="Delete data?"
          description={
            <>
              Data will be deleted permanently.
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
