"use client"

import * as React from "react"
import {
  useOutletsQuery,
  useCreateOutlet,
  useUpdateOutlet,
  useDeleteOutlet,
} from "@/app/dashboard/outlet/hooks/use"
import type { UpdateOutletInput, OutletFormValue, OutletItem } from "@/lib/api/outlet/req-api"

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
import { OutletFormDialog } from "@/components/dialog/form-outlet"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

const emptyForm: OutletFormValue = {
  name: "",
  outletType: "",
  address:"",
  number:"",
  province:"",
  city:"",
  postalCode:"",
  status:""
}

export default function DiscountPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedDiscount, setSelectedDiscount] = React.useState<OutletItem | null>(null)

  /** data */
  const { data, isLoading } = useOutletsQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateOutlet()
  const updateMut = useUpdateOutlet()
  const deleteMut = useDeleteOutlet()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<OutletItem | null>(null)
  const [form, setForm] = React.useState<OutletFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: OutletItem) => {
    setEditing(u)

    setForm({
      name: u.name ?? "",
      outletType : u.outletType ?? "",
      address : u.address ?? "",
      number : u.number ?? "",
      province : u.province ?? "",
      city : u.city ?? "",
      postalCode : u.postalCode ?? "",
      status : u.status ?? ""
    })
    setOpen(true)
  }

  const onSubmit = async (data: OutletFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          outletType : data.outletType ?? "",
          address : data.address ?? "",
          number : data.number ?? "",
          province : data.province ?? "",
          city : data.city ?? "",
          postalCode : data.postalCode ?? "",
          status : data.status ?? ""
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateOutletInput })
        toast.success("Table berhasil diperbarui")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Table berhasil dibuat")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedDiscount) return

    try {
      await deleteMut.mutateAsync(selectedDiscount.id??"")
      toast.success(`Table "${selectedDiscount.name}" dihapus`)
      setConfirmOpen(false)
      setSelectedDiscount(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const discounts = data?.data ?? []
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
          <h1 className="text-2xl font-semibold">Outlet</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading} className=" dark:text-white">
              Create
            </Button>
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Outlet Type</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && discounts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                discounts.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>{v.address}</TableCell>
                    <TableCell>{v.outletType}</TableCell>
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
                          setSelectedDiscount(v)
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
        <OutletFormDialog
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
          title="Delete discount?"
          description={
            <>
              Discount <b>{selectedDiscount?.name}</b> akan dihapus permanen.
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
