"use client"

import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { LoadingOverlay } from "@/components/ui/loading"
import { useDetailReportSessionQuery } from "../hooks/use"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { formatCurrency, formatDateTime } from "@/lib/helpers"
import { ArrowLeft, DollarSign, ShoppingBasket, Sparkles } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined

  /**
   * =========================
   * QUERY
   * =========================
   */
  const { data, isLoading } = useDetailReportSessionQuery(orderId!)
  const listData = data?.data?.transactions ?? []
  const summaryData = data?.data?.summary

  return (
    
    <DashboardLayout>
      {/* Fullscreen overlay saat create/edit/delete */}
      <LoadingOverlay show={isLoading} fullscreen label="Processing..." />

      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 justify-center">
            <div 
              className="flex items-center justify-center cursor-pointer"
              onClick={() => router.back()}
            >
              <ArrowLeft size={20}/>
            </div>            
            <h1 className="text-2xl font-semibold">Detail Report</h1>
          </div>
        </div>

        {/* card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-green-200 px-2 py-2">
                    <DollarSign color="green"/>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    Total Pendapatan
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-start px-2">
                <div className="text-xl font-bold">{formatCurrency(summaryData?.totalRevenue ??  0)}</div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground font-medium px-2">
                Pendapatan Kotor
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-amber-200 px-2 py-2">
                    <Sparkles color="orange"/>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    Total Transaksi
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-start px-2">
                <div className="text-xl font-bold">{summaryData?.totalTransactions ??  0}</div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground font-medium px-2">
                Penjualan
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                <div className="flex items-start gap-2 justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-blue-300 px-2 py-2">
                    <ShoppingBasket color="blue"/>
                  </div>
                  <div className="flex items-center gap-2 text-lg text-muted-foreground">
                    Avg Order
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-start px-2">
                <div className="text-xl font-bold">{formatCurrency(summaryData?.avgOrder ??  0)}</div>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground font-medium px-2">
                vs Yesterday
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table (overlay di area table saat load data) */}
        <div className="relative rounded-xl border bg-background overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Name</TableHead>
                <TableHead>Transaction Date</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Paymnent Mehotd</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!isLoading && listData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                listData.map((v, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{v.customerName ?? "-"}</TableCell>
                    <TableCell className="font-medium">{formatDateTime(v.createdAt) ?? "-"}</TableCell>
                    <TableCell className="font-medium">{v.number ?? "-"}</TableCell>
                    <TableCell className="font-medium">{v.paymentMethod ?? "-"}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(v.total)}</TableCell>
                    <TableCell className="font-medium capitalize">
                      <div className={`${v.status === "cancelled" ? "text-red-500" : "text-green-500"}`}>{v.status}</div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  )
}