"use client"

import * as React from "react"
import {
  useStocksQuery,
  useCreateStock,
  useUpdateStock,
  useDeleteStock,
  useCountStocks,
} from "@/app/dashboard/master-data/inventory/ingridients/hooks/use"
import type { UpdateStockInput, StockFormValue, StockItem } from "@/lib/api/inventory/req-api"

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
import { StockFormDialog } from "@/components/dialog/form-stock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, BadgeCheck, TriangleAlert } from "lucide-react"

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

const emptyForm: StockFormValue = {
  name: "",
  outletId: process.env.NEXT_PUBLIC_OUTLET_ID ?? "",
  unit: "",
  currentStock: 0,
  minimumStock: 0,
}

export default function StockPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedStock, setSelectedStock] = React.useState<StockItem | null>(null)

  /** data */
  const { data, isLoading } = useStocksQuery({
    page,
    perPage,
    search: debouncedSearch,
  })

  const { data: countData } = useCountStocks()

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateStock()
  const updateMut = useUpdateStock()
  const deleteMut = useDeleteStock()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<StockItem | null>(null)
  const [form, setForm] = React.useState<StockFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: StockItem) => {
    setEditing(u)

    setForm({
      name: u.name ?? "",
      outletId: u.outletId ?? "",
      unit: u.unit ?? "",
      currentStock: u.currentStock ?? 0,
      minimumStock: u.minimumStock ?? 0,
    })
    setOpen(true)
  }

  const onSubmit = async (data: StockFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          outletId: data.outletId,
          unit: data.unit,
          currentStock: data.currentStock,
          minimumStock: data.minimumStock,
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateStockInput })
        toast.success("Ingredient successfully updated")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Ingredient successfully created")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedStock) return

    try {
      await deleteMut.mutateAsync(selectedStock.id??"")
      toast.success(`Ingredient "${selectedStock.name}" deleted`)
      setConfirmOpen(false)
      setSelectedStock(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const Stocks = data?.data ?? []
  const total = data?.paginate?.total
  const serverPerPage = data?.paginate?.perPage ?? perPage
  const hasNext = data?.paginate?.next != null

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
          <h1 className="text-2xl font-semibold">Ingredients List</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading}>
              Create Ingredient
            </Button>
          </div>
        </div>

        {/* card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-2">
                    <BadgeCheck color="green"/>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Safe
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end px-2">
                <div className="text-xl font-bold">{countData?.data?.SAFE ??  0}</div>
                <div className="text-sm font-medium text-muted-foreground">item</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-amber-200 px-2 py-2">
                    <TriangleAlert color="orange"/>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Low
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end px-2">
                <div className="text-xl font-bold">{countData?.data?.LOW ??  0}</div>
                <div className="text-sm font-medium text-muted-foreground">item</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-red-100 px-2 py-2">
                    <AlertOctagon color="red"/>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    Out
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-end px-2">
                <div className="text-xl font-bold">{countData?.data?.OUT ??  0}</div>
                <div className="text-sm font-medium text-muted-foreground">item</div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Min Stock</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && Stocks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                Stocks.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell className="font-medium">{v.currentStock} {v.unit}</TableCell>
                    <TableCell className="font-medium">{v.minimumStock} {v.unit}</TableCell>
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
                          setSelectedStock(v)
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
            pageSize={serverPerPage}
            total={total}
            hasNext={hasNext}
            onPageChange={setPage}
          />
        </div>

        {/* Form dialog */}
        <StockFormDialog
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
          title="Delete Ingredient?"
          description={
            <>
              Stock <b>{selectedStock?.name}</b> akan dihapus permanen.
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
