"use client"

import { useParams, useRouter } from "next/navigation"
import { HeaderWithBackground } from "@/components/public/component/HeaderWithBackground"
import { useQuery } from "@tanstack/react-query"
import { getOrderList } from "@/lib/api/customer/req-api"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { SwitchTableDrawer } from "./SwitchTableDrawer"
import { useTablesQuery, useUpdateSwitchTable } from "@/app/dashboard/master-data/tables/hooks/use"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/toast-error"

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()

  const [switchTable, setSwitchTable] = useState(false)
  const [tableCurrentId, setTableCurrentId] = useState("")
  const updateSwitchTableMut = useUpdateSwitchTable()

  const orderId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : undefined

  /**
   * =========================
   * QUERY
   * =========================
   */
  const {
    data: orderList,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction-order", orderId],
    queryFn: () => getOrderList([orderId!]),
    enabled: !!orderId, // ⬅️ ini cukup
  })


  const { data : TABLE_OPTIONS } = useTablesQuery({
    page : 1,
    perPage : 1000,
    search: "",
  })
  
  /**
   * =========================
   * LOADING
   * =========================
   */
  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <p>Loading...</p>
      </div>
    )
  }

  /**
   * =========================
   * ERROR / NOT FOUND
   * =========================
   */
  if (isError || !orderList?.data?.length) {
    return (
      <div className="p-6 text-center">
        <p>Order not found</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-primary underline"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const transaction = orderList.data[0]

  const total = transaction.subTransactions.length
  const completed = transaction.subTransactions.map((sub) => sub.status).filter((status) => status === "completed").length

  const handleSwitchTable = async (data: {
    fromTable: string
    tableId: string
    note?: string
  }) => {
    if (!data.tableId) return

    try {
      await updateSwitchTableMut.mutateAsync({
        fromTable: transaction.id,
        tableId: data.tableId,
        note: data.note,
      })

      toast.success("Discount menu berhasil diperbarui")
      setSwitchTable(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }
  /**
   * =========================
   * PAGE
   * =========================
   */
  return (
    <div className="min-h-screen bg-gray-100 max-w-lg mx-auto pb-28">
      <HeaderWithBackground title="Order Status" url="/" />

      <div className="p-4 space-y-4">
        <div className="font-semibold text-xl">
          Transaction {transaction.paymentNumber}
        </div>

        <div className="bg-white rounded-sm p-4 px-6 shadow space-y-1 text-sm">
          <div className="flex gap-2 items-center text-base font-semibold">
            <span>
              <Image
                src={'/images/coffee.png'} alt={'coffee'} width={20} height={20} />
            </span>
            <span>Your order is being prepared</span>
          </div>

          <div className="flex gap-1 items-center text-sm font-semibold text-muted-foreground">
            <span>{transaction.customerName}</span> -
            <span>{transaction?.table?.name ?? "Not Selected"}</span>
          </div>
          
          <div className="flex gap-1 items-center text-sm font-semibold text-muted-foreground">
            <span>{completed}</span> of {total} items completed
          </div>

          <hr className="border-dashed my-2"/>

          {/* menu */}
          <div className="flex flex-col gap-2">
            {transaction.subTransactions.map ((item) => {
              return(
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-sm overflow-hidden bg-muted">
                      <Image
                        src={item.menu.img}
                        alt={item.menu.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-sm">
                        {item.menu.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.menu.name}
                      </p>
                    </div>
                  </div>

                  <Badge 
                    variant="outline" 
                    className={`text-xs rounded-sm capitalize 
                      ${
                        item.status === "completed" ? "bg-[#52C66B33] text-[#52C66B]" : 
                        item.status === "preparation" ? "bg-[#006FEE33] text-[#006FEE]" : 
                        "bg-red-500/25 text-red-500"
                      }`}
                  >
                    {item.status}
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
        
        <div 
          className="font-semibold text-sm my-2 text-center"
          onClick={() => {
            setSwitchTable(true)
            setTableCurrentId(transaction.tableId ?? "")
          }}
        >
          Switch table? <span className="text-xs text-blue-500 cursor-pointer">Click here</span>
        </div>
        <SwitchTableDrawer
          open={switchTable}
          onOpenChange={setSwitchTable}
          currentTable={tableCurrentId}
          tableOptions={TABLE_OPTIONS?.data ?? []}
          onSubmit={(data) => {
            handleSwitchTable(data)
          }}
        />
      </div>
    </div>
  )
}