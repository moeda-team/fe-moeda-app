import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiClock, FiX, FiRefreshCw } from "react-icons/fi";
import { HiArrowLeft, HiChevronLeft, HiChevronRight, HiSparkles } from "react-icons/hi";
import { formatToIDR } from "@/utils/formatCurrency";
import { AdminLayout } from "@/components/layout";
import { useActiveOrder } from "@/swr/get/activeOrder";
import moment from "moment";
import { useRouter } from "next/router";
import { BiDollar, BiTrendingUp } from "react-icons/bi";
import { useSummaryRevenue } from "@/swr/get/dashboardAdmin";

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
  month?: string;
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

const History: React.FC = () => {
  const router = useRouter();
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedMonthN, setSelectedMonthN] = useState<string>("");
  const [selectedYearN, setSelectedYearN] = useState<string>("");

  const { summaryRevenue } = useSummaryRevenue(selectedYearN, selectedMonthN);

  const { activeOrder } = useActiveOrder(
    currentPage,
    rowsPerPage,
    "",
    false,
    selectedMonthN,
    selectedYearN
  );

  // generate daftar 12 bulan terakhir
  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const date = moment().subtract(i, "months");
      return {
        value: date.format("YYYY-MM"), // simpan dalam format YYYY-MM
        label: date.format("MMMM YYYY"),
      };
    });
  }, []);

  const formattedTransactions = useMemo(() => {
    if (!Array.isArray(activeOrder?.transactions)) return [];

    return activeOrder.transactions
      .map((tx: any) => {
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
          month: moment(tx.createdAt).format("YYYY-MM"), // bulan transaksi
        };
      })
      .filter((tx: any) =>
        selectedMonth ? tx.month === selectedMonth : true
      );
  }, [activeOrder?.transactions, selectedMonth]);

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

  return (
    <AdminLayout>
      <div
        className="flex flex-col gap-4 p-1"
        style={{ height: "calc(100vh - 180px)" }}
      >
        <div className="flex justify-center">
          <div className="w-96 flex flex-col gap-4 p-1">
            {/* Header */}
            <div className="border-neutral-200 sticky top-0 z-10">
              <div className="flex justify-start gap-4 items-center">
                <div
                  className="cursor-pointer"
                  onClick={() => router.push(`/admin-menu`)}
                >
                  <HiArrowLeft size={20} />
                </div>
                <div className="w-full text-lg font-bold text-center pr-10">
                  Finance
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="text-base font-semibold">
                  Transaction
                </div>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(e.target.value)
                                  
                    const [year, month] = e.target.value.split("-"); // pisah jadi array
                    console.log(year)
                    setSelectedYearN(year);
                    setSelectedMonthN(month);
                  }}
                  className="border border-neutral-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Semua Bulan</option>
                  {monthOptions.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Card Session */}
              <div className="grid grid-cols-1 gap-2">
                {/* Revenue */}
                <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
                  <div className="flex justify-between">
                    <div className="bg-green-200 p-2 rounded-full">
                      <BiDollar size={25} className="text-white bg-green-500 p-1 rounded-full"/>
                    </div>
                    <div className="text-neutral-300 lg:text-xl text-sm">Moeda + Hompimpa</div>
                  </div>
                  <div className="flex justify-between">
                    <div className="font-bold lg:text-xl text-xl">{formatToIDR(summaryRevenue.grossRevenue??0)}</div>
                    <div className={`font-bold lg:text-xl text-xl text-green-600 ${summaryRevenue.growthPercentage > 0 ? "text-green-500" : "text-red-500"}`}>
                      {summaryRevenue.growthPercentage}%
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-neutral-300 text-sm">Gross Income</div>
                    <div className="text-neutral-300 text-sm">VS prev month</div>
                  </div>
                </div>
              </div>
      
              {/* Avg Order */}
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
                  <div className="flex justify-between">
                    <div className="bg-yellow-200 p-2 rounded-full">
                      <HiSparkles size={25} className="text-white bg-yellow-500 p-1 rounded-full"/>
                    </div>
                    <div className="text-neutral-300 lg:text-xl text-sm">Moeda</div>
                  </div>
                  <div className="font-bold text-lg">{formatToIDR(summaryRevenue.revenueMoeda)}</div>
                  <div className="text-neutral-300 text-sm">Revenue</div>
                </div>
      
                {/* Growth */}
                <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
                  <div className="flex justify-between">
                    <div className="bg-blue-200 p-1 rounded-full">
                      <BiTrendingUp size={30} className="text-white p-1 rounded-full" color="blue"/>
                    </div>
                    <div className="text-neutral-300 lg:text-xl text-sm">Hompimpa</div>
                  </div>
                  <div className="font-bold text-lg">{formatToIDR(summaryRevenue.revenueHompimpa)}</div>
                  <div className="text-neutral-300 text-sm">Fee</div>
                </div>
      
              </div>
            </div>
            
            {/* History */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-base">
                  Latest Transaction
                </div>
                <div
                  className="cursor-pointer underline font-semibold text-sm"
                  onClick={() => router.push(`/admin-menu/history`)}
                >
                  View All
                </div>
              </div>

              <div className="overflow-x-auto bg-white p-2 rounded-xl">
                <div className="min-w-full">
                  <table className="w-full table-fixed">
                    <thead className="border-b">
                      <tr>
                        <th className="w-60 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          ID Transaction
                        </th>
                        <th className="w-48 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="w-20 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Table
                        </th>
                        <th className="w-20 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Items
                        </th>
                        <th className="w-32 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="w-32 py-2 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200">
                      <AnimatePresence>
                        {formattedTransactions.map((order: Order, index: number) => {
                          const statusConfig: StatusConfig = getStatusConfig(order.status);
                          const StatusIcon = statusConfig.icon;

                          return (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`hover:bg-neutral-50 transition-colors duration-150 ${
                                selectedOrders.includes(order.id) ? "bg-primary-50" : ""
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
                                    statusConfig.bg
                                  } ${statusConfig.border} ${statusConfig.text} w-fit rounded-full px-2 py-1`}
                                >
                                  <StatusIcon className="w-4 h-4" />
                                  <div className="text-sm font-medium">
                                    {statusConfig.label}
                                  </div>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
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
