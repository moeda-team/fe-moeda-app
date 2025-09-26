import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheck, FiClock, FiX, FiRefreshCw } from "react-icons/fi";
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { formatToIDR } from "@/utils/formatCurrency";
import { AdminLayout } from "@/components/layout";
import { useActiveOrder } from "@/swr/get/activeOrder";
import { debounce } from "lodash";
import moment from "moment";
import { useRouter } from "next/router";

// Types
interface Order {
  id: string;
  customerName: string;
  paymentNumber: string;
  tableNumber: string;
  totalAmount: number;
  status: "preparation" | "ready" | "completed" | "failed" | "pending";
  items: number;
  orderTime: string;
}

type StatusType = "preparation" | "ready" | "completed" | "failed" | "pending";
type FilterType = "all" | StatusType;

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface HistoryProps {
  orders?: Order[];
  onViewOrder?: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onBulkComplete?: (orderIds: string[]) => void;
  onBulkCancel?: (orderIds: string[]) => void;
}

const History: React.FC<HistoryProps> = ({}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { activeOrder } = useActiveOrder(
    currentPage,
    rowsPerPage,
    searchQuery,
    false
  );

  const formattedTransactions = useMemo(() => {
    if (!Array.isArray(activeOrder?.transactions)) return [];

    return activeOrder?.transactions.map((tx: any, index: number) => {
      const orderTime = moment(tx.createdAt).format("HH:mm DD-MM-YYYY");

      const items = tx.subTransactions.reduce(
        (acc: number, sub: any) => acc + sub.quantity,
        0
      );

      return {
        id: tx.id,
        customerName: tx.customerName || "-",
        paymentNumber: tx.paymentNumber || "-",
        tableNumber: String(tx.tableNumber),
        totalAmount: parseInt(tx.total, 10),
        status: tx.status,
        items,
        orderTime,
      };
    });
  }, [activeOrder?.transactions]);

  // Status styling
  const getStatusConfig = (status: StatusType): StatusConfig => {
    const configs: Record<StatusType, StatusConfig> = {
      preparation: {
        bg: "bg-warning-50",
        text: "text-warning-600",
        border: "border-warning-200",
        icon: FiClock,
        label: "Pending",
      },
      ready: {
        bg: "bg-info-50",
        text: "text-info-600",
        border: "border-info-200",
        icon: FiRefreshCw,
        label: "Processing",
      },
      completed: {
        bg: "bg-success-50",
        text: "text-success-600",
        border: "border-success-200",
        icon: FiCheck,
        label: "Completed",
      },
      failed: {
        bg: "bg-danger-50",
        text: "text-danger-600",
        border: "border-danger-200",
        icon: FiX,
        label: "Failed",
      },
      pending: {
        bg: "bg-warning-50",
        text: "text-warning-600",
        border: "border-warning-200",
        icon: FiClock,
        label: "Pending",
      },
    };
    return configs[status];
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Debounced setter
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
      }, 500), // 500ms debounce delay
    []
  );

  // Input handler
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    debouncedSearch(e.target.value);
  };
  const router = useRouter();

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-1" style={{ height: "calc(100vh - 180px)" }}>
        <div className="flex justify-center">
          <div className="w-96 flex flex-col gap-4 p-1">
            {/* Header */}
            <div className="border-neutral-200 sticky top-0 z-10">
              <div className="flex justify-start gap-4 items-center">
                <div className="cursor-pointer" onClick={() => router.push(`/admin-menu`)}>
                  <HiArrowLeft size={20} />
                </div>
                <div className="w-full text-lg font-bold text-center pr-10">History</div>
              </div>
              <div>
                
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white p-2 rounded-xl">
              <div className="min-w-full">
                {/* Header Table */}
                <table className="w-full table-fixed">
                  <thead className="border-b">
                    <tr>
                      <th className="w-60 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-1">ID Transaction</div>
                      </th>
                      <th className="w-48 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-1">Customer</div>
                      </th>
                      <th className="w-20 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Table
                      </th>
                      <th className="w-20 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="w-32 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors">
                        <div className="flex items-center gap-1">Total</div>
                      </th>
                      <th className="w-32 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <AnimatePresence>
                      {Array.isArray(formattedTransactions) &&
                        formattedTransactions?.length > 0 &&
                        formattedTransactions?.map(
                          (order: Order, index: number) => {
                            const statusConfig: StatusConfig = getStatusConfig(
                              order.status
                            );
                            const StatusIcon = statusConfig
                              ? statusConfig.icon
                              : null;

                            return (
                              <motion.tr
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                                className={`hover:bg-neutral-50 transition-colors duration-150 ${
                                  selectedOrders.includes(order.id)
                                    ? "bg-primary-50"
                                    : ""
                                }`}
                              >
                                <td className="w-60 py-2 text-sm font-medium text-neutral-900">
                                  {order.paymentNumber}
                                </td>
                                <td className="w-48 py-2">
                                  <div>
                                    <div className="text-sm font-medium text-neutral-900 truncate">
                                      {order.customerName}
                                    </div>
                                    <div className="text-xs text-neutral-500">
                                      {order.orderTime}
                                    </div>
                                  </div>
                                </td>
                                <td className="w-20 py-2 text-sm text-neutral-900">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                    {order.tableNumber}
                                  </span>
                                </td>
                                <td className="w-20 py-2 text-sm text-neutral-500">
                                  {order.items} items
                                </td>
                                <td className="w-32 py-2 text-sm font-medium text-neutral-900">
                                  <div className="truncate">
                                    {formatToIDR(order.totalAmount)}
                                  </div>
                                </td>
                                <td className="w-32 py-2">
                                  <div
                                    className={`flex items-center gap-2 ${
                                      statusConfig?.bg || ""
                                    } ${statusConfig?.border || ""} ${
                                      statusConfig?.text || ""
                                    } w-fit rounded-full px-2 py-1`}
                                  >
                                    {StatusIcon && (
                                      <StatusIcon className="w-4 h-4" />
                                    )}
                                    <div className="text-sm font-medium">
                                      {order.status}
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          }
                        )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="py-2 border-t border-neutral-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={handleRowsPerPageChange}
                    className="border border-neutral-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-500">
                  Page {activeOrder?.pagination?.page} of{" "}
                  {activeOrder?.pagination?.totalPages}
                </span>
                <div className="flex gap-1">
                  <motion.button
                    onClick={() =>
                      setCurrentPage(Math.max(1, activeOrder?.pagination?.page - 1))
                    }
                    disabled={activeOrder?.pagination?.page === 1}
                    className="p-2 rounded-md border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(
                          activeOrder?.pagination?.totalPages,
                          activeOrder?.pagination?.page + 1
                        )
                      )
                    }
                    disabled={
                      activeOrder?.pagination?.page ===
                      activeOrder?.pagination?.totalPages
                    }
                    className="p-2 rounded-md border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default History;
