"use client"

import * as React from "react"
import {
  useUsersQuery,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/app/dashboard/users/hooks/use"
import type { UserFormValue, UserItem } from "@/lib/api/users/req-api"

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
import {
  UserFormDialog,
} from "@/components/dialog/form-users"
import { useDebounce } from "@/components/use-debounce"
import { ConfirmDialog } from "@/components/dialog/confirm-dialog"

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

const emptyForm: UserFormValue = {
  name: "",
  phoneNumber: "",
  outletId: process.env.NEXT_PUBLIC_OUTLET_ID,
  email: "",
  password: "",
  roles: "HRD",
  status: "active",
  position: "",
  address: "",
  gender: "",
  fee: 0,
}

export default function UsersPage() {
  /** paging + search */
  const [page, setPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [search, setSearch] = React.useState("")
  const debouncedSearch = useDebounce(search, 400)

  /** confirm delete */
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null)

  /** data */
  const { data, isLoading } = useUsersQuery({
    page,
    perPage,
    search: debouncedSearch,
  })

  React.useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  /** mutations */
  const createMut = useCreateUser()
  const updateMut = useUpdateUser()
  const deleteMut = useDeleteUser()

  /** dialog form */
  const [open, setOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<UserItem | null>(null)
  const [form, setForm] = React.useState<UserFormValue>(emptyForm)

  const openCreate = () => {
    setEditing(null)
    setForm(emptyForm)
    setOpen(true)
  }

  const openEdit = (u: UserItem) => {
    setEditing(u)
    setForm({
      name: u.name ?? "",
      phoneNumber: u.phoneNumber ?? "",
      outletId: u.outletId ?? "",
      email: u.email ?? "",
      status: u.status ?? "",
      password: "",
      roles: u.role as UserFormValue["roles"],
      position: u.position ?? "",
      address: u.address ?? "",
      gender: u.gender ?? "",
      fee: Number(u.fee) ?? 0,
    })
    setOpen(true)
  }

  const onSubmit = async (data: UserFormValue) => {
    try {
      if (editing) {
        const payload: Record<string, unknown> = {
          name: data.name,
          phoneNumber: data.phoneNumber,
          email: data.email,
          roles: data.roles,
          position: data.position ? data.position : data.roles ? data.roles.replace("_", " ").toLowerCase() : "",
          address: data.address,
          gender: data.gender,
          outletId: data.outletId,
          isVerified: true,
        }

        if (data.password) payload.password = data.password

        await updateMut.mutateAsync({ id: editing.id, input: payload })
        toast.success("User berhasil diperbarui")
      } else {
        await createMut.mutateAsync(data)
        toast.success("User berhasil dibuat")
      }

      setOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedUser) return

    try {
      await deleteMut.mutateAsync(selectedUser.id)
      toast.success(`User "${selectedUser.name}" dihapus`)
      setConfirmOpen(false)
      setSelectedUser(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  const users = data?.data ?? []
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
          <h1 className="text-2xl font-semibold">Users</h1>

          <div className="flex gap-2">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ..."
              className="w-full sm:w-80"
              disabled={fullscreenLoading}
            />
            <Button onClick={openCreate} disabled={fullscreenLoading}>
              Create User
            </Button>
          </div>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead className="w-[180px]">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!tableLoading && users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.position}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(u)}
                        disabled={fullscreenLoading}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedUser(u)
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
        <UserFormDialog
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
          title="Delete user?"
          description={
            <>
              User <b>{selectedUser?.name}</b> akan dihapus permanen.
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
