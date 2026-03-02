"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import {
  useDiscountsQuery,
  useCreateDiscount,
  useUpdateDiscount,
  useDeleteDiscount,
  useUpdateDiscountMenu,
} from "@/app/dashboard/master-data/discount/hooks/use"
import type { UpdateDiscountsInput, DiscountFormValue, DiscountsItem, UpdateDiscountsInputMenu } from "@/lib/api/discounts/req-api"

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
import { Badge } from "@/components/ui/badge"
import { SelectMenuDialogPro } from "@/components/dialog/select-menu-dialog"
import { getMenus } from "@/lib/api/menu/req-api"

const PER_PAGE_OPTIONS = [5, 10, 25, 50, 100]

const emptyForm: DiscountFormValue = {
  name: "",
  type: "",
  discount: 0,
  maxUsage: 0,
  expiredAt: "",
  allMenu: false,
}

export default function DiscountPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  // ===== MENU DIALOG =====
  const [openMenuDialog, setOpenMenuDialog] = React.useState(false)
  const [selectedDiscountId, setSelectedDiscountId] = React.useState("")

  // RHF khusus dialog menu
  const menuForm = useForm<{ menuIds: string[] }>({
    defaultValues: {
      menuIds: [],
    },
  })
  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedDiscount, setSelectedDiscount] = React.useState<DiscountsItem | null>(null)

  /** data */
  const { data, isLoading } = useDiscountsQuery({
    page,
    limit : perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateDiscount()
  const updateMut = useUpdateDiscount()
  const deleteMut = useDeleteDiscount()
  const updateMenuMut = useUpdateDiscountMenu()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<DiscountsItem | null>(null)
  const [form, setForm] = React.useState<DiscountFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: DiscountsItem) => {
    setEditing(u)

    setForm({
      name: u.name ?? "",
      type: u.type ?? "",
      discount: u.discount ?? 0,
      maxUsage: u.maxUsage ?? 0,
      expiredAt: formatDate(u.expiredAt ?? "", "yyyy-MM-dd") ?? "",
      allMenu: u.allMenu ?? false,
    })
    setOpen(true)
  }

  const onSubmit = async (data: DiscountFormValue) => {
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

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateDiscountsInput })
        toast.success("Discount berhasil diperbarui")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Discount berhasil dibuat")
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
      toast.success(`Discount "${selectedDiscount.name}" dihapus`)
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

  const handleMenuIntegration = async (menuIds: string[]) => {
    if (!selectedDiscountId) return

    try {
      await updateMenuMut.mutateAsync({
        discountId: selectedDiscountId ?? "",
        menuId: menuIds,
      })

      toast.success("Discount menu berhasil diperbarui")
      setOpenMenuDialog(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={fullscreenLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Discount</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading} className="dark:text-white">
              Create Discount
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
                <TableHead>Menu</TableHead>
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
                  <TableRow key={v.id} className={v.expiredAt < new Date().toISOString() ? "hover:bg-accent" : ""}>
                    <TableCell className="font-medium">{v.name}</TableCell>
                    <TableCell>
                      {v.type === "fixed" ? formatCurrency(v.discount) : `${v.discount}%`}
                    </TableCell>
                    <TableCell>{v.maxUsage}</TableCell>
                    <TableCell>{formatDate(v.expiredAt, "dd MMMM yyyy")}</TableCell>
                    <TableCell>
                      <Badge 
                        className={ v.allMenu ? "bg-primary text-primary-foreground cursor-pointer" : "bg-[#E35336]/20 text-[#E35336] cursor-pointer"}
                        onClick={() => {
                          if (!v.allMenu) {
                            const discountMenus = v.discountMenus.map((dm) => dm.menu.id)

                            menuForm.reset({
                              menuIds: discountMenus,
                            })

                            setSelectedDiscountId(v.id??"")
                            setOpenMenuDialog(true)
                          }
                        }}
                      >
                        {v.allMenu ? "All Menu" : `${v.discountMenus.length} Selected`}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="dark:text-white"
                        onClick={() => openEdit(v)}
                        disabled={fullscreenLoading}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="dark:text-white"
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
          type="discount"
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
        <SelectMenuDialogPro
          open={openMenuDialog}
          onOpenChange={setOpenMenuDialog}
          control={menuForm.control}
          name="menuIds"
          multiple
          fetchData={async ({ search }) => {
            const res = await getMenus({
              search,
            })

            return {
              data: res.data.map((m) => ({
                id: m.id,
                label: m.name,
                img: m.img,
                description: formatCurrency(Number(m.price)),
              })),
              hasMore: false,
            }
          }}
          onSave={(ids) => {
            handleMenuIntegration(ids)
          }}
        />
      </div>
    </DashboardLayout>
  )
}
