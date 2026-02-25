"use client"

import * as React from "react"
import {
  useMenuQuery,
  useCreateMenu,
  useUpdateMenu,
  useDeleteMenu,
  useUpdateMenuOption,
  useDeleteBestMenu,
  useCreateBestMenu,
} from "@/app/dashboard/master-data/menu/hooks/use"
import type { UpdateMenuInput,  Menuitem, MenuForm, BestSellerMenu } from "@/lib/api/menu/req-api"

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
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Settings, X } from "lucide-react"
import { useState } from "react"
import { MenuOption } from "@/lib/api/customer/req-api"
import { VariantSettingDrawer } from "./options/VariantSettingDrawer"
import { MenuFormValueOptions } from "@/lib/option-utils"
import { FormMenuDrawer } from "./FormMenuDrawer"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { BestSellerFormDialog } from "@/components/dialog/form-best"

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

const emptyForm: MenuForm = {
  name: "",
  categoryId: "",
  desc: "",
  img: "",
  price: 0,
}
const emptyFormBest: BestSellerMenu = {
  id: "",
  menuId: "",
  order: 0,
}

export default function MenuPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Menuitem | null>(null)
  const [openVariantDialog, setOpenVariantDialog] = useState(false)
  const [selectedVariant, setSelectedVariant] = useState<MenuOption[] | null>(null)

  /** data */
  const { data, isLoading } = useMenuQuery({
    page,
    perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateMenu()
  const updateMut = useUpdateMenu()
  const deleteMut = useDeleteMenu()
  const updateOptionMut = useUpdateMenuOption()

  const createBestMut = useCreateBestMenu()
  const deleteBestMut = useDeleteBestMenu()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Menuitem | null>(null)
  const [form, setForm] = React.useState<MenuForm>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const [openBest, setOpenBest] = React.useState(false)
  const [editingBest, setEditingBest] = React.useState<BestSellerMenu | null>(null)
  const [formBest, setFormBest] = React.useState<BestSellerMenu>(emptyFormBest)

  const openCreateBest = (data: Menuitem) => {
    setEditingBest({
      menuId: data.id ?? "",
      order: 0,
      id: "",
    })
    setFormBest({
      menuId: data.id ?? "",
      order: 0,
      id: "",
    })
    setOpenBest(true)
  }

  const openEdit = (u: Menuitem) => {
    setEditing(u)

    setForm({
      name: u.name ?? "",
      categoryId: u.categoryId ?? "",
      desc: u.desc ?? "",
      img: u.img ?? "",
      price: Number(u.price) ?? 0,
    })
    setOpen(true)
  }

  const onSubmit = async (data: MenuForm) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          categoryId: data.categoryId,
          desc: data.desc,
          img: data.img,
          price: data.price,
          pdf: undefined,
        }

        await updateMut.mutateAsync({ id: editing.id ?? "", input: payload as UpdateMenuInput })
        toast.success("Menu berhasil diperbarui")
      } else {
        await createMut.mutateAsync(data)
        toast.success("Menu berhasil dibuat")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selected) return

    try {
      await deleteMut.mutateAsync(selected.id??"")
      toast.success(`Menu "${selected.name}" dihapus`)
      setConfirmOpen(false)
      setSelected(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const onSubmitBest = async (data: BestSellerMenu) => {
    try {
      await createBestMut.mutateAsync({
        menuId: data.menuId,
        order: Number(data.order),
      })
      toast.success("Menu berhasil dijadikan best seller")

      setOpenBest(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }
  const deleteBest = async (data:BestSellerMenu) => {
    if (!data) return

    try {
      await deleteBestMut.mutateAsync(data.id??"")
      toast.success(`Behasil`)
      setConfirmOpen(false)
      setSelected(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const s = data?.data ?? []
  const total = data?.paginate?.total
  const serverPerPage = data?.paginate?.perPage ?? perPage
  const hasNext = data?.paginate?.next != null

  /** overlays */
  const tableLoading = isLoading
  const fullscreenLoading = createMut.isPending || updateMut.isPending || deleteMut.isPending

  const openVariant = (row: Menuitem) => {
    
    const options = row.options.map((option) => option.data).flat()

    setSelectedVariant(options as MenuOption[])
    setSelected(row)
    setOpenVariantDialog(true)
  }
    
  function normalizeOptions(options: MenuOption[]): MenuOption[] {
    return options.map((option) => ({
      ...option,
      choices: option.choices.map((choice) => ({
        ...choice,
        extraPrice: choice.extraPrice ?? 0,
        subOptions: choice.subOptions
          ? normalizeOptions(choice.subOptions)
          : [],
      })),
    }))
  }

  const handlerVariant = async (data: MenuOption[]) => {
    try {
      const payload: MenuFormValueOptions = {
        menuId: selected?.id ?? "",
        data: normalizeOptions(data),
      }

      await updateOptionMut.mutateAsync(payload)
      toast.success("Options berhasil diperbarui")

      setOpenVariantDialog(false)
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
          <h1 className="text-2xl font-semibold">Menu</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading}>
              Create Menu
            </Button>
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Discount Menu</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead>Best Seller</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && s.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                s.map((v) => (
                  <TableRow key={v.id} className={"hover:bg-accent " + (v.discountMenus.length > 0 ? "bg-primary/20" : "")}>
                    <TableCell className="font-medium">
                      <div className="flex gap-2 items-center">
                        <Image src={v.img} alt={v.name} width={50} height={50} className="rounded-lg border border-primary/50"/>
                        <div className="">
                          <div className="font-medium">{v.name}</div>
                          <div className="text-xs text-muted-foreground" title={v.desc}>{v.desc.length > 30 ? v.desc.substring(0, 30) + "..." : v.desc}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(Number(v.price))}</TableCell>
                    <TableCell className="font-medium">{v.discountMenus.length}</TableCell>
                    <TableCell className="font-medium">
                      <Badge
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => openVariant(v)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        {v.options.length > 0 ? `${v.options.length} Variant` : "No Variant"}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center justify-between rounded-md border p-3">
                        <Label>{v.bestSellerMenus.length > 0 ? "Ke : " + v.bestSellerMenus[0].order : <X />}</Label>
                        <Switch
                          checked={v.bestSellerMenus.length > 0}
                          onCheckedChange={(data) =>{
                            if(data){
                              openCreateBest(v)
                            }else{
                              deleteBest(v.bestSellerMenus[0])
                            }
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Badge variant={v.isActive ? "default" : "destructive"}>{v.isActive ? "Active" : "Inactive"}</Badge>
                    </TableCell>
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
                          setSelected(v)
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

        {/* Confirm delete */}
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete ?"
          description={
            <>
               <b>{selected?.name}</b> akan dihapus permanen.
            </>
          }
          confirmText="Delete"
          confirmVariant="destructive"
          loading={deleteMut.isPending}
          onConfirm={handleConfirmDelete}
        />

        {/* DRAWER */}
        <VariantSettingDrawer
          open={openVariantDialog}
          onOpenChange={setOpenVariantDialog}
          value={selectedVariant}
          onSubmit={(data) => {
            handlerVariant(data)
          }}
        />
        
        <FormMenuDrawer 
          open={open} 
          onOpenChange={setOpen}
          value={form}
          onSubmit={(data) => {
            onSubmit(data)
          }}
        />
        
        {/* Form dialog */}
        <BestSellerFormDialog
          open={openBest}
          onOpenChange={setOpenBest}
          editing={editingBest}
          value={formBest}
          onChange={setFormBest}
          onSubmit={(data) => {
            onSubmitBest(data)
          }}
          loading={createMut.isPending || updateMut.isPending}
        />
      </div>
    </DashboardLayout>
  )
}

