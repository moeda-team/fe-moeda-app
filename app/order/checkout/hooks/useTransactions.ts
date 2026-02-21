"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransactionStatus,
  type TransactionsQueryParams,
  type TransactionsListResponse,
  type CreateTransactionInput,
} from "@/lib/api/customer/req-api"

/**
 * =========================
 * QUERY KEYS
 * =========================
 */
const transactionsKey = (params?: TransactionsQueryParams) =>
  ["transactions", params ?? {}] as const

const transactionDetailKey = (id: string) =>
  ["transaction", id] as const

/**
 * =========================
 * GET LIST
 * =========================
 */
export function useTransactionsQuery(params?: TransactionsQueryParams) {
  return useQuery<TransactionsListResponse>({
    queryKey: transactionsKey(params),
    queryFn: () => getTransactions(params),
  })
}

/**
 * =========================
 * GET DETAIL
 * =========================
 */
export function useTransactionDetail(id: string) {
  return useQuery({
    queryKey: transactionDetailKey(id),
    queryFn: () => getTransactionById(id),
    enabled: !!id,
  })
}

/**
 * =========================
 * CREATE TRANSACTION
 * =========================
 */
export function useCreateTransaction() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateTransactionInput) =>
      createTransaction(input),

    onSuccess: async (data) => {
      // invalidate list
      await qc.invalidateQueries({ queryKey: ["transactions"] })

      // optional: set detail cache directly
      qc.setQueryData(transactionDetailKey(data.id), data)
    },
  })
}

/**
 * =========================
 * UPDATE STATUS (paid/cancel)
 * =========================
 */
export function useUpdateTransactionStatus() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string
      status: "pending" | "paid" | "cancelled"
    }) => updateTransactionStatus(id, status),

    onSuccess: async (_, variables) => {
      await qc.invalidateQueries({ queryKey: ["transactions"] })
      await qc.invalidateQueries({
        queryKey: transactionDetailKey(variables.id),
      })
    },
  })
}