"use client"

import * as React from "react"
import {
  useActivitiesQuery,
  useCreateActivity,
  useUpdateActivity,
  useDeleteActivity,
} from "@/app/dashboard/master-data/inventory/activity/hooks/use"
import type { UpdateActivityInput, ActivityFormValue, ActivityItem } from "@/lib/api/activity/req-api"

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, BadgeCheck, Trash, TriangleAlert } from "lucide-react"
import { useCountStocks, useStocksQuery } from "../ingridients/hooks/use"
import { formatDate } from "date-fns"
import { ActivityFormDialog } from "@/components/dialog/form-activity"

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

const emptyForm: ActivityFormValue = {
  inventoryId: "",
  type: "",
  quantity: 0,
  notes: "",
}

export default function DiscountPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedActivity, setSelectedActivity] = React.useState<ActivityItem | null>(null)

  /** data */
  const { data, isLoading } = useActivitiesQuery({
    page,
    perPage,
    search: debouncedSearch,
  })

  const { data: countData } = useCountStocks()

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateActivity()
  const updateMut = useUpdateActivity()
  const deleteMut = useDeleteActivity()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<ActivityItem | null>(null)
  const [form, setForm] = React.useState<ActivityFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: ActivityItem) => {
    setEditing(u)

    setForm({
      inventoryId: u.inventoryId ?? "",
      type: u.type ?? "",
      quantity: u.quantity ?? 0,
      notes: u.notes ?? "",
    })
    setOpen(true)
  }

  const onSubmit = async (data: ActivityFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          inventoryId: data.inventoryId,
          type: data.type,
          quantity: data.quantity,
          notes: data.notes,
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateActivityInput })
        toast.success("Success update activity")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Success create activity")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedActivity) return

    try {
      await deleteMut.mutateAsync(selectedActivity.id??"")
      toast.success(`Table "${selectedActivity.inventoryId}" dihapus`)
      setConfirmOpen(false)
      setSelectedActivity(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const discounts = data?.data ?? []
  const total = data?.paginate?.total
  const serverPerPage = data?.paginate?.perPage ?? perPage
  const hasNext = data?.paginate?.next != null

  /** overlays */
  const tableLoading = isLoading
  const fullscreenLoading = createMut.isPending || updateMut.isPending || deleteMut.isPending

  const { data : ingridientData, } = useStocksQuery({
      page,
      perPage,
      search: debouncedSearch,
    })

  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={fullscreenLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Activity List</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading}>
              Create Activity
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
                <TableHead>Inventory</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Action By</TableHead>
                <TableHead>Last Update</TableHead>
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
                    <TableCell className="font-medium">
                      <div> {v?.inventory?.name ??""}</div>
                      <div 
                        style={{
                          color: v?.type === "ADD" ? "green" : v?.type === "REDUCE" ? "red" : "#000"
                        }}
                      > 
                        {v?.type === "ADD" ? "+" : v?.type === "REDUCE" ? "-" : ""}
                        {v?.quantity ??""} {v?.inventory?.unit ??""}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium capitalize">
                      <div> {v?.inventory?.name ??""}</div>
                      <div 
                        style={{
                          color: v?.type === "ADD" ? "green" : v?.type === "REDUCE" ? "red" : "#000"
                        }}
                      > 
                        {v?.type === "UPDATE" ? "Update" : ""}
                        {v?.type.toLowerCase()}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{v?.note}</TableCell>
                    <TableCell className="font-medium">{v?.user?.name ?? ""}</TableCell>
                    <TableCell className="font-medium">{formatDate(v?.updatedAt, "dd MMMM yyyy HH:mm") ?? ""}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          if(v.type==="ADJUST"){
                            toast.error(
                              "ADJUST activities cannot be deleted to maintain data integrity",
                            )

                            return false
                          }
                          setSelectedActivity(v)
                          setConfirmOpen(true)
                        }}
                        disabled={fullscreenLoading}
                      >
                        <Trash color="red" />
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
        <ActivityFormDialog
          open={open}
          onOpenChange={setOpen}
          editing={editing}
          value={form}
          onChange={setForm}
          onSubmit={(data) => {
            onSubmit(data)
          }}
          loading={createMut.isPending || updateMut.isPending}
          ingridientData={ingridientData?.data ?? []}
        />

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete activity?"
          description={
            <>
              Activity <b>{selectedActivity?.inventory?.name}</b> akan dihapus permanen.
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
