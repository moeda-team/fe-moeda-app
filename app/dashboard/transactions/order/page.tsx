"use client"

import * as React from "react"

import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LoadingOverlay } from "@/components/ui/loading"

import { toast } from "sonner"
import { getErrorMessage } from "@/lib/toast-error"
import { Button } from "@/components/ui/button"
import { MenuForm } from "@/lib/api/menu/req-api"
import { FormMenuDrawer } from "../../master-data/menu/FormMenuDrawer"
import { useCreateMenu } from "../../master-data/menu/hooks/use"
import { useBestsellerQuery, useCategoriesQuery } from "@/components/public/hooks/use"
import { useMenuQuery } from "@/components/public/hooks/use"
import { useEffect, useState } from "react"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Minus, Plus, SearchIcon, ShoppingCart, TicketPercent, Trash2, XIcon } from "lucide-react"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import { CardBest } from "@/components/public/component/best/page"
import { useTablesQuery } from "../../master-data/tables/hooks/use"
import { useCustomerStore } from "@/store/customer.store"
import { EditCustomerDrawer } from "@/app/order/checkout/EditCustomerDrawer"
import { CardMenu } from "@/components/public/component/menu/page"
import { useCartStore } from "@/store/cart.store"
import { mappingOption } from "@/lib/option-utils"
import { EditCartItemDrawer } from "./EditCartItemDrawer"
import { formatCurrency } from "@/lib/helpers"
import { CheckoutDrawer } from "./CheckoutDrawer"
import BillDrawer from "../BillDrawer"

const emptyForm: MenuForm = {
  name: "",
  categoryId: "",
  desc: "",
  img: "",
  price: 0,
}

export default function TransactionsListPage() {
  //!! Menu
  const [open, setOpen] = React.useState(false)
  const [form, setForm] = React.useState<MenuForm>(emptyForm)
  const createMut = useCreateMenu()

  const openCreate = () => {
    setForm(emptyForm)
    setOpen(true)
  }
  
  const onSubmit = async (data: MenuForm) => {
    try {
      await createMut.mutateAsync(data)
      setOpen(false)
      toast.success("Menu berhasil dibuat")
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }
  //!! Menu

  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>('All')
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const { data : categoriesData, isLoading : isLoadingCategories } = useCategoriesQuery()
  const { data : bestData, isLoading : isLoadingBest } = useBestsellerQuery()
  const { data : menuData, isLoading : isLoadingMenu } = useMenuQuery({ search : debouncedSearch, category : selectedCategory === 'All' ? "" : selectedCategory ? selectedCategory : undefined })
  const { data : tableData } = useTablesQuery({ search: ""})
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput)
    }, 500) // 500ms delay

    return () => {
      clearTimeout(handler)
    }
  }, [searchInput])
  
  /** overlays */
  const fullscreenLoading = isLoadingCategories

  const name = useCustomerStore((s) => s.name)
  const table = useCustomerStore((s) => s.table)
  const getInitials = (name?: string) => {
    if (!name || !name.trim()) return "N/A"

    const parts = name.trim().split(/\s+/)

    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }

    return (parts[0][0] + parts[1][0]).toUpperCase()
  }

  // cart
  const items = useCartStore((s) => s.items)
  const updateQty = useCartStore((s) => s.updateQty)
  const removeItem = useCartStore((s) => s.removeItem)

  const [openBill, setOpenBill] = React.useState(false)
  const [billId, setBillId] = React.useState<string>("")

  return (
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={fullscreenLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold">Order</h1>

          <div className="flex gap-2">
            <Button onClick={openCreate} disabled={fullscreenLoading}>
              Create Menu
            </Button>
          </div>
        </div>

        <hr />

        <div className="relative rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {/* product list */}
            <div className="col-span-1 lg:col-span-2 gap-4 bg-transparent rounded-xl shadow-sm border border-primary/20 max-h-[calc(100vh-200px)] overflow-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 flex flex-col justify-end items-center gap-2  py-4 px-4 bg-white">
                <div className="w-full">
                  <InputGroup className="w-full">
                    <InputGroupInput placeholder="Search product..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
                    <InputGroupAddon>
                      <SearchIcon className="text-primary" size={18} />
                    </InputGroupAddon>
                    {searchInput && (
                      <InputGroupAddon onClick={() => setSearchInput("")} className="cursor-pointer end-4 absolute">
                        <XIcon className="text-primary" size={18} />
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </div>
                
                <div className="w-full">
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent className="my-1">
                      <CarouselItem
                        className="basis-auto cursor-pointer"
                        onClick={() => setSelectedCategory("All")}
                      >
                        <div
                          className={`px-4 py-1 rounded-full text-xs whitespace-nowrap transition ${
                            selectedCategory === "All"
                              ? "bg-primary text-white"
                              : "bg-primary/10"
                          }`}
                        >
                          All
                        </div>
                      </CarouselItem>

                      {categoriesData?.data?.map((item) => (
                        <CarouselItem
                          key={item.id}
                          className="basis-auto cursor-pointer"
                          onClick={() => setSelectedCategory(item.id)}
                        >
                          <div
                            className={`px-2 py-1 rounded-full text-xs whitespace-nowrap transition ${
                              selectedCategory === item.id
                                ? "bg-primary text-white"
                                : "bg-primary/10"
                            }`}
                          >
                            {item.name}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
              </div>
              
              {/* best */}
              <div className="space-y-1 p-4 ">
                {bestData && bestData?.data.length >0 && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold">
                      Best Seller
                    </h2>
                    {
                      isLoadingBest ? 
                        <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-40 rounded-2xl bg-primary/30"
                          />
                        ))}
                        </div> : 
                      <CardBest data={bestData?.data ?? []} />
                    }
                  </div>
                )}
              </div>
              {/* end best */}

              {/* menu list */}
              <div className="space-y-3 p-4 ">
                <h2 className="text-lg font-semibold">
                  Menu
                </h2>
                {
                  isLoadingMenu ? 
                    <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className="h-40 rounded-2xl bg-primary/30"
                      />
                    ))}
                    </div> : 
                  <CardMenu data={menuData?.data ?? []} />
                }
      
                {menuData?.data?.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground">
                    No menu found
                  </p>
                )}
              </div>
                      
            </div>

            {/* cart */}
            <div className="relative scol-span-1 space-y-2 bg-transparent rounded-xl shadow-sm border border-primary/20  max-h-[calc(100vh-200px)] overflow-auto">
              {/* customer info */}
              <div className="bg-white rounded-t-sm p-3 shadow-sm sticky top-0 z-10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-[#F3A93B] text-lg text-white font-semibold p-2 h-10 w-10 flex items-center justify-center">
                      {getInitials(name)}
                    </div>
      
                    <div>
                      <p className="text-sm">Customer</p>
                      <p className="font-semibold text-base">
                        {name}{" "}
                        <span className="text-xs font-normal">
                          ({table ? tableData?.data?.find((t) => t.id === table)?.name : "Not Selected"})
                        </span>
                      </p>
                      {!name && <p className="text-xs text-red-500">Please select customer</p>}
                    </div>
                  </div>
      
                  <EditCustomerDrawer tableOptions={tableData?.data ?? []}/>
                </div>
              </div>

              {/* cart list */}
              <div className="px-3 py-2 space-y-4 min-h-[calc(94vh-300px)]">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm p-2 relative"
                  >
                    <div className="flex gap-4">
                      {/* INFO */}
                      <div className="flex flex-col justify-between gap-1">
                        <div className="flex flex-col">
                          <div className="text-sm font-bold">
                            {item.name}
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {item?.options ? mappingOption(item.options, item.menuItem.options ?? []) : ""}
                        </div>

                        <div className="flex flex-col">
                          {/* NOTE */}
                          <div className="text-xs text-muted-foreground">
                            {item.note}
                          </div>

                          {/* PRICE */}
                          <div className="flex flex-col space-y-1 text-sm">
                            <div className="flex items-center gap-4">
                              {item.discountAmount > 0 && (
                                <p className="text-sm line-through text-[#E35336] min-w-18">
                                  Rp {item.subtotal.toLocaleString("id-ID")}
                                </p>
                              )}
                              <div className="flex items-center">
                                {item.menuItem.discountMenus.length > 0 && (
                                  <div className="bg-[#E35336] text-[10px] px-2 py-0.5 rounded-sm text-white">{item.menuItem.discountMenus[0].discount.name}</div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <p className="font-semibold  min-w-18">
                                Rp {item.finalPrice.toLocaleString("id-ID")}
                              </p>

                              {item.discountAmount > 0 && (
                                <div className="bg-green-200 text-[10px] px-2 py-0.5 rounded-sm text-green-900 flex items-center">
                                  <TicketPercent size={15}/>
                                  {item.menuItem.discountMenus[0].discount.type === "fixed" ? (
                                    <div className="text-[10px] ml-1">Rp.{item.menuItem.discountMenus[0].discount.discount.toLocaleString()}</div>
                                  ) : (
                                    <div className="text-[10px] ml-1">{item.menuItem.discountMenus[0].discount.discount}%</div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>


                    {/* BOTTOM ACTION */}
                    <div className="flex justify-between items-center mt-2 bg-primary/10 rounded-lg border border-primary">
                      {/* QTY */}
                      <div className="flex items-center gap-2 text-xs bg-white rounded-l-lg h-8 px-2">
                        <button
                          onClick={() =>{
                            updateQty(item.id, item.qty - 1)
                            if (item.qty <= 1) {
                              removeItem(item.id)
                            }
                          }}
                          className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{item.qty}</span>

                        <button
                          onClick={() =>
                            updateQty(item.id, item.qty + 1)
                          }
                          className="h-5 w-5 rounded-full bg-primary text-white flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* REMOVE */}
                      <div>
                      <EditCartItemDrawer item={item} />
                      <button
                        onClick={() => removeItem(item.id)}
                        className="bg-[#E35336] text-white px-2 py-2 rounded-r-lg text-xs"
                      >
                        <Trash2 size={16}/>
                      </button>
                      </div>
                    </div>
                  </div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                    <p className="text-gray-500">Cart is empty</p>
                  </div>
                )}
              </div>

              {/* payment button */}
              <div className="bg-white rounded-t-sm p-3 py-4 shadow-sm sticky bottom-0 z-10 mx-auto">
                <Button 
                  onClick={() => setCheckoutOpen(true)}
                  className="text-center w-full"
                  disabled={fullscreenLoading}
                >
                  Checkout {formatCurrency(items.map(item => item.finalPrice).reduce((a, b) => a + b, 0))}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* dialog */}
        <FormMenuDrawer 
          open={open} 
          onOpenChange={setOpen}
          value={form}
          onSubmit={(data) => {
            onSubmit(data)
          }}
        />

        <CheckoutDrawer
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          onSuccess={(data:string) => {
            setCheckoutOpen(false)
            setOpenBill(true)
            setBillId(data)
          }}
        />
        
        <BillDrawer
          open={openBill}
          onClose={() => setOpenBill(false)}
          transactionId={billId}
        />
      </div>
    </DashboardLayout>
  )
}
