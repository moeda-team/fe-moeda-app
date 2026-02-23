import { CompletedOrderDetails } from "@/store/order.store"
import { axiosClient } from "../axios-client"
import { Menuitem } from "../menu/req-api"

export type CategoryItem = {
  id: string
  icon: string
  name: string
  outletId: string | null
}

export type UserItem = {
  id: string
  fullname: string
  username: string
  phoneNumber: string | null
  email: string
  roles: string
  isVerified: boolean
}

export type UsersQueryParams = {
  page?: number
  perPage?: number
  search?: string
}

export type Paginate = {
  page: number
  perPage: number
  total: number
  lastPage: number
  prev: number | null
  next: number | null
}

export type UsersListResponse = {
  statusCode: number
  additional: unknown
  data: UserItem[]
  paginate: Paginate
}

export type CreateUserInput = {
  fullname: string
  username: string
  phoneNumber: string | null
  email: string
  roles: string
  isVerified: boolean
  password: string
}

export type UpdateUserInput = {
  fullname?: string
  username?: string
  phoneNumber?: string | null
  email?: string
  roles?: string
  isVerified?: boolean
}

// category
export type CategoryQueryParams = {
  search?: string
}

export type CategoryListResponse = {
  statusCode: number
  additional: unknown
  data: CategoryItem[]
  paginate: Paginate
}

export type MenuQueryParams = {
  search?: string
  category?: string
  best?: string
}

export type MenuListResponse = {
  statusCode: number
  additional: unknown
  data: Menuitem[]
  paginate: Paginate
}

export type Choice = {
  label: string
  value: string
  extraPrice?: number,
  subOptions?: MenuOption[]
}

export type MenuOption = {
  id: string
  label: string
  type: "single" | "multiple"
  required?: boolean
  choices: Choice[]
}

export async function getCategories(
  params?: CategoryQueryParams
): Promise<CategoryListResponse> {
  const res = await axiosClient.get<CategoryListResponse>(`/menus/categories`, { params })
  return res.data
}

export type TransactionStatus =
  | "pending"
  | "completed"
  | "paid"
  | "cancelled"
  | "expired"

export type CreateTransactionInput = {
  outletId : string,
  transactionType : string,
  tableNumber : number,
  paymentMethod : string,
  customerName : string,
  discount : number,
  additionalNote : string,
  voucher : string,
  cart : TransactionItem[]
}

export type TransactionItem = {
  menuId : string ,
  menuName : string,
  quantity : number,
  price : number,
  subTotal : number,
  addOn : string,
  note : string
}

export type Transaction = {
  id: string
  outletId: string
  transactionType: string
  tableNumber: string
  paymentMethod: string
  paymentNumber: string
  customerName: string
  discount: number
  tax: number
  service: number
  total: number
  status: TransactionStatus
  qrUrl?: string
  createdAt: string
  updatedAt: string
  expiredAt : string
  actions? : {
    url : string,
    type : string
  }[],
  details : CompletedOrderDetails
}

export type TransactionsQueryParams = {
  page?: number
  limit?: number
  status?: TransactionStatus
}

export type TransactionsListResponse = {
  data: Transaction[]
  total: number
  page: number
  limit: number
}

export type TransactionResponse = {
  data: Transaction
}

export async function createTransaction(
  input: CreateTransactionInput
): Promise<TransactionResponse> {
  const res = await axiosClient.post("/transactions/main", input)

  if (!res) {
    throw new Error("Failed to create transaction")
  }

  return res.data
}

/**
 * =========================
 * GET LIST
 * =========================
 */
export async function getTransactions(
  params?: TransactionsQueryParams
): Promise<TransactionsListResponse> {
  const query = new URLSearchParams()

  if (params?.page) query.append("page", String(params.page))
  if (params?.limit) query.append("limit", String(params.limit))
  if (params?.status) query.append("status", params.status)

  const res = await axiosClient.get<TransactionsListResponse>(`/transactions/main?${query.toString()}`)

  if (!res) {
    throw new Error("Failed to fetch transactions")
  }

  return res.data
}

/**
 * =========================
 * GET DETAIL
 * =========================
 */
export async function getTransactionById(
  id: string
): Promise<TransactionResponse> {
  const res = await axiosClient.get<TransactionResponse>(`/transactions/payments/${id}`)

  if (!res) {
    throw new Error("Failed to fetch transaction")
  }

  return res.data
}

export async function checkTransactionStatus(
  id: string
): Promise<TransactionResponse> {
  const res = await axiosClient.get<TransactionResponse>(`/transactions/payments/status/${id}`)

  if (!res) {
    throw new Error("Failed to fetch transaction")
  }

  return res.data
}

export async function getTransactionByPaymentNumber(
  id: string,
  type: string
): Promise<TransactionResponse> {
  const res = await axiosClient.post<TransactionResponse>(`/transactions/payments`, {
    transactionDetails: {
      orderId : id,
    },
    paymentType: type
  })

  if (!res) {
    throw new Error("Failed to fetch transaction")
  }

  return res.data
}

export type TransactionCalculateResponse = {
  data: {
    subTotal : number,
    discount : number,
    tax : number,
    discountMenu : number,
    serviceCharge : number,
    total : number
    rounding : number
  }
}

export async function getTransactionCalculate(
  paymentMethod: string,
  total: number,
  discount: number,
  discountMenu: number,
): Promise<TransactionCalculateResponse> {
  const res = await axiosClient.post<TransactionCalculateResponse>(`/transactions/main/calculate`, {
    paymentMethod,
    total,
    discount,
    discountMenu,
  })

  if (!res) {
    throw new Error("Failed to fetch transaction")
  }

  return res.data
}

/**
 * =========================
 * UPDATE STATUS
 * =========================
 */
export async function updateTransactionStatus(
  id: string,
  status: TransactionStatus
): Promise<TransactionResponse> {
  const res = await axiosClient.patch<TransactionResponse>(`/transactions/main/${id}/status`, {
    status,
  })

  if (!res) {
    throw new Error("Failed to update status")
  }

  return res.data
}

// order
export interface Menu {
  id: string
  outletId: string
  name: string
  desc: string
  img: string
  price: string
  pdf: string
  categoryId: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

/**
 * =========================
 * SUB TRANSACTION
 * =========================
 */

export interface SubTransaction {
  id: string
  transactionId: string
  menuId: string
  menuName: string
  quantity: number
  price: string
  subTotal: string
  addOn: string
  note: string
  status: "preparation" | "completed" | "cancelled"
  createdAt: string
  updatedAt: string
  menu: Menu
}

/**
 * =========================
 * LOG TABLE MOVE
 * =========================
 */

export interface LogTableMove {
  id: string
  outletId: string
  transactionId: string
  tableNumber: number
  prevTableId: string | null
  nextTableId: string | null
  note: string | null
  createdAt: string
  updatedAt: string
}

/**
 * =========================
 * TRANSACTION
 * =========================
 */

export interface TransactionOrder {
  id: string
  userId: string | null
  outletId: string
  number: string
  transactionType: string
  tableNumber: number
  paymentNumber: string
  paymentMethod: string
  customerName: string
  totalSubTransaction: number
  subTotal: string
  discount: string
  tax: string
  serviceCharge: string
  rounding: string
  total: string
  additionalNote: string
  voucherId: string | null
  status: "pending" | "completed" | "cancelled"
  fraudStatus: string
  createdAt: string
  updatedAt: string
  subTransactions: SubTransaction[]
  logTableMove: LogTableMove[]
}

export type OrderListResponse = {
  data: TransactionOrder[]
}

export async function getOrderList(
  orderId : string[]
): Promise<OrderListResponse> {
  const res = await axiosClient.post<OrderListResponse>(`/transactions/main/check/status`, {orderIds:orderId})

  if (!res) {
    throw new Error("Failed to fetch transaction")
  }

  return res.data
}