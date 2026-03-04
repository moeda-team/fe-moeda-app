import { axiosClient } from "../axios-client"

export type ReportItem = {
  id?: string,
  orderId: string,
  orderName: string,
  description: string,
  qty: number,
  total: number,
  paymentMethod: string,
  status: string,
  createdAt: string
}

export type ReportFormValue = {
  amount: number,
  type: "ADD" | "REDUCE",
  description: string,
  cancelNote?: string,
}

export type ReportQueryParams = {
  page?: number
  limit?: number
  search?: string
  date?: string
}

export type Paginate = {
  page: number
  perPage: number
  total: number
  lastPage: number
  prev: number | null
  next: number | null
}

export type ReportListResponse = {
  data : {
    statusCode: number
    additional: unknown
    details: ReportItem[]
    summary : {
      date : string,
      yesterdayDate : string,
      totalRevenue : number,
      totalTransactions : number,
      avgOrder : number,
      revenueGrowth : number,
      transactionGrowth : number,
      avgOrderGrowth : number
    }
    pagination: Paginate
  }
}

export type CreateReportInput = ReportFormValue

export type UpdateReportInput = ReportFormValue

export async function getReport(
  params?: ReportQueryParams
): Promise<ReportListResponse> {
  const res = await axiosClient.get<ReportListResponse>("/reports/daily", { params })
  return res.data
}

export async function createReport (input: CreateReportInput) {
  const res = await axiosClient.post("/reports/daily", input)
  return res.data
}

export async function updateReport(id: string, input: UpdateReportInput) {
  const res = await axiosClient.put(`/reports/daily/${id}`, input)
  return res.data
}

export async function deleteReport(id: string) {
  const res = await axiosClient.delete(`/reports/daily/${id}`)
  return res.data
}

export async function checkSession() {
  const res = await axiosClient.get(`/reports/cash-books/check`)
  return res.data
}

export async function openSession () {
  const res = await axiosClient.post("/reports/cash-books")
  return res.data
}

export async function closeSession () {
  const res = await axiosClient.patch("/reports/cash-books/close")
  return res.data
}

export type ReportSessionItem = {
  id: string,
  openAt: string,
  closeAt: string,
  totalTransactions: number,
  totalRevenue: number,
  status: string,
  user: {
    id: string,
    name: string
  }
}

export type ReportSessionListResponse = {
  statusCode: number
  additional: unknown
  data: ReportSessionItem[]
  pagination: Paginate
}

export async function getReportSession(
  params?: ReportQueryParams
): Promise<ReportSessionListResponse> {
  const res = await axiosClient.get<ReportSessionListResponse>("/reports/cash-books", { params })
  return res.data
}

export type ReportSessionDetailResponse = {
  statusCode: number
  additional: unknown
  data: {
    summary : {
      date : string,
      yesterdayDate : string,
      totalRevenue : number,
      totalTransactions : number,
      avgOrder : number,
      revenueGrowth : number,
      transactionGrowth : number,
      avgOrderGrowth : number
    },
    transactions :{
        id: string,
        number: string,
        transactionType: string,
        paymentMethod: string,
        customerName: string,
        total: number,
        status: string,
        createdAt: string
    }[]
  }
  pagination: Paginate
}

export async function getDetailReportSession(id:string): Promise<ReportSessionDetailResponse> {
  const res = await axiosClient.get<ReportSessionDetailResponse>(`/reports/cash-books/${id}`)
  return res.data
}