import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiChevronDown,
  FiCheck,
  FiDownload,
  FiArchive,
} from "react-icons/fi";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { formatToIDR } from "@/utils/formatCurrency";
import { AdminLayout } from "@/components/layout";

// Types
interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  totalAmount: number;
  status: "preparing" | "ready" | "completed" | "cancelled";
  items: number;
  orderTime: string;
}

type StatusType = "preparing" | "ready" | "completed" | "cancelled";
type FilterType = "all" | StatusType;
type SortableColumns = "id" | "customerName" | "totalAmount" | "orderTime";
type SortOrder = "asc" | "desc";

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface ActiveOrderProps {
  orders?: Order[];
  onViewOrder?: (orderId: string) => void;
  onEditOrder?: (orderId: string) => void;
  onDeleteOrder?: (orderId: string) => void;
  onBulkComplete?: (orderIds: string[]) => void;
  onBulkCancel?: (orderIds: string[]) => void;
}

// Mock data with proper typing
const mockCompletedOrders: Order[] = [
  {
    id: "01",
    customerName: "Hiroshi Tanaka",
    tableNumber: "10",
    totalAmount: 73161,
    status: "completed",
    items: 4,
    orderTime: "09:19 AM",
  },
  {
    id: "02",
    customerName: "Dennis Schulist",
    tableNumber: "8",
    totalAmount: 155055,
    status: "completed",
    items: 1,
    orderTime: "09:34 AM",
  },
  {
    id: "03",
    customerName: "Kenji Fujimoto",
    tableNumber: "10",
    totalAmount: 227546,
    status: "completed",
    items: 4,
    orderTime: "09:28 AM",
  },
  {
    id: "04",
    customerName: "Darlene Robertson",
    tableNumber: "2",
    totalAmount: 83761,
    status: "completed",
    items: 2,
    orderTime: "09:54 AM",
  },
  {
    id: "05",
    customerName: "Jenny Wilson",
    tableNumber: "3",
    totalAmount: 108943,
    status: "completed",
    items: 6,
    orderTime: "10:08 AM",
  },
  {
    id: "06",
    customerName: "Arlene McCoy",
    tableNumber: "8",
    totalAmount: 77850,
    status: "completed",
    items: 1,
    orderTime: "10:42 AM",
  },
  {
    id: "07",
    customerName: "Esther Howard",
    tableNumber: "7",
    totalAmount: 78037,
    status: "completed",
    items: 4,
    orderTime: "11:53 AM",
  },
  {
    id: "08",
    customerName: "Kathryn Murphy",
    tableNumber: "3",
    totalAmount: 53222,
    status: "completed",
    items: 1,
    orderTime: "09:30 AM",
  },
  {
    id: "09",
    customerName: "Wade Warren",
    tableNumber: "4",
    totalAmount: 161837,
    status: "completed",
    items: 4,
    orderTime: "09:49 AM",
  },
  {
    id: "10",
    customerName: "Esther Howard",
    tableNumber: "3",
    totalAmount: 160081,
    status: "completed",
    items: 4,
    orderTime: "10:33 AM",
  },
  {
    id: "11",
    customerName: "Howard Bader",
    tableNumber: "2",
    totalAmount: 178800,
    status: "completed",
    items: 2,
    orderTime: "09:56 AM",
  },
  {
    id: "12",
    customerName: "Jerome Bell",
    tableNumber: "7",
    totalAmount: 126434,
    status: "completed",
    items: 5,
    orderTime: "10:00 AM",
  },
  {
    id: "13",
    customerName: "Howard Bader",
    tableNumber: "2",
    totalAmount: 140886,
    status: "completed",
    items: 2,
    orderTime: "10:07 AM",
  },
  {
    id: "14",
    customerName: "Jane Cooper",
    tableNumber: "2",
    totalAmount: 111194,
    status: "completed",
    items: 3,
    orderTime: "11:36 AM",
  },
  {
    id: "15",
    customerName: "Ervin Howell",
    tableNumber: "1",
    totalAmount: 97809,
    status: "completed",
    items: 4,
    orderTime: "11:03 AM",
  },
  {
    id: "16",
    customerName: "Hiroshi Tanaka",
    tableNumber: "2",
    totalAmount: 217668,
    status: "completed",
    items: 5,
    orderTime: "09:09 AM",
  },
  {
    id: "17",
    customerName: "Leslie Alexander",
    tableNumber: "6",
    totalAmount: 177368,
    status: "completed",
    items: 2,
    orderTime: "09:41 AM",
  },
  {
    id: "18",
    customerName: "Cody Fisher",
    tableNumber: "2",
    totalAmount: 40331,
    status: "completed",
    items: 1,
    orderTime: "09:31 AM",
  },
  {
    id: "19",
    customerName: "Ralph Edwards",
    tableNumber: "1",
    totalAmount: 114440,
    status: "completed",
    items: 5,
    orderTime: "09:35 AM",
  },
  {
    id: "20",
    customerName: "Clementina DuBuque",
    tableNumber: "7",
    totalAmount: 210806,
    status: "completed",
    items: 6,
    orderTime: "11:23 AM",
  },
  {
    id: "21",
    customerName: "Kristin Watson",
    tableNumber: "4",
    totalAmount: 100742,
    status: "completed",
    items: 4,
    orderTime: "10:24 AM",
  },
  {
    id: "22",
    customerName: "Robert Fox",
    tableNumber: "5",
    totalAmount: 189692,
    status: "completed",
    items: 5,
    orderTime: "11:57 AM",
  },
  {
    id: "23",
    customerName: "Briana Moore",
    tableNumber: "10",
    totalAmount: 80589,
    status: "completed",
    items: 6,
    orderTime: "11:03 AM",
  },
  {
    id: "24",
    customerName: "Clementina DuBuque",
    tableNumber: "1",
    totalAmount: 96457,
    status: "completed",
    items: 5,
    orderTime: "10:27 AM",
  },
  {
    id: "25",
    customerName: "Hiroshi Tanaka",
    tableNumber: "3",
    totalAmount: 91568,
    status: "completed",
    items: 4,
    orderTime: "10:53 AM",
  },
  {
    id: "26",
    customerName: "Nicholas Bauch",
    tableNumber: "10",
    totalAmount: 58408,
    status: "completed",
    items: 6,
    orderTime: "10:13 AM",
  },
  {
    id: "27",
    customerName: "Kurtis Weissnat",
    tableNumber: "9",
    totalAmount: 70081,
    status: "completed",
    items: 3,
    orderTime: "10:07 AM",
  },
  {
    id: "28",
    customerName: "Kathryn Murphy",
    tableNumber: "1",
    totalAmount: 200292,
    status: "completed",
    items: 4,
    orderTime: "11:37 AM",
  },
  {
    id: "29",
    customerName: "Akira Nishikawa",
    tableNumber: "9",
    totalAmount: 164161,
    status: "completed",
    items: 4,
    orderTime: "11:54 AM",
  },
  {
    id: "30",
    customerName: "Brooklyn Simmons",
    tableNumber: "1",
    totalAmount: 212086,
    status: "completed",
    items: 3,
    orderTime: "09:05 AM",
  },
  {
    id: "31",
    customerName: "Kurtis Weissnat",
    tableNumber: "3",
    totalAmount: 118087,
    status: "completed",
    items: 3,
    orderTime: "11:04 AM",
  },
  {
    id: "32",
    customerName: "Clementina DuBuque",
    tableNumber: "1",
    totalAmount: 35833,
    status: "completed",
    items: 6,
    orderTime: "09:42 AM",
  },
  {
    id: "33",
    customerName: "Clementina DuBuque",
    tableNumber: "7",
    totalAmount: 100142,
    status: "completed",
    items: 2,
    orderTime: "09:13 AM",
  },
  {
    id: "34",
    customerName: "Darrell Steward",
    tableNumber: "8",
    totalAmount: 49403,
    status: "completed",
    items: 4,
    orderTime: "11:08 AM",
  },
  {
    id: "35",
    customerName: "Esther Howard",
    tableNumber: "5",
    totalAmount: 134277,
    status: "completed",
    items: 1,
    orderTime: "11:57 AM",
  },
  {
    id: "36",
    customerName: "Guy Hawkins",
    tableNumber: "3",
    totalAmount: 96905,
    status: "completed",
    items: 6,
    orderTime: "09:28 AM",
  },
  {
    id: "37",
    customerName: "Kenji Fujimoto",
    tableNumber: "6",
    totalAmount: 182559,
    status: "completed",
    items: 6,
    orderTime: "10:13 AM",
  },
  {
    id: "38",
    customerName: "Hiroshi Tanaka",
    tableNumber: "1",
    totalAmount: 59955,
    status: "completed",
    items: 6,
    orderTime: "11:13 AM",
  },
  {
    id: "39",
    customerName: "Jenny Wilson",
    tableNumber: "1",
    totalAmount: 98224,
    status: "completed",
    items: 2,
    orderTime: "11:38 AM",
  },
  {
    id: "40",
    customerName: "Courtney Henry",
    tableNumber: "8",
    totalAmount: 153822,
    status: "completed",
    items: 1,
    orderTime: "10:21 AM",
  },
  {
    id: "41",
    customerName: "Dennis Schulist",
    tableNumber: "10",
    totalAmount: 115210,
    status: "completed",
    items: 2,
    orderTime: "10:34 AM",
  },
  {
    id: "42",
    customerName: "Rina Sato",
    tableNumber: "9",
    totalAmount: 103870,
    status: "completed",
    items: 3,
    orderTime: "11:55 AM",
  },
  {
    id: "43",
    customerName: "Leanne Graham",
    tableNumber: "5",
    totalAmount: 101796,
    status: "completed",
    items: 1,
    orderTime: "11:38 AM",
  },
  {
    id: "44",
    customerName: "Jenny Wilson",
    tableNumber: "4",
    totalAmount: 176408,
    status: "completed",
    items: 4,
    orderTime: "09:28 AM",
  },
  {
    id: "45",
    customerName: "Devon Lane",
    tableNumber: "4",
    totalAmount: 135599,
    status: "completed",
    items: 3,
    orderTime: "10:22 AM",
  },
  {
    id: "46",
    customerName: "Cody Fisher",
    tableNumber: "9",
    totalAmount: 71883,
    status: "completed",
    items: 6,
    orderTime: "10:33 AM",
  },
  {
    id: "47",
    customerName: "Jacob Jones",
    tableNumber: "2",
    totalAmount: 225758,
    status: "completed",
    items: 3,
    orderTime: "09:59 AM",
  },
  {
    id: "48",
    customerName: "Leanne Graham",
    tableNumber: "4",
    totalAmount: 135107,
    status: "completed",
    items: 2,
    orderTime: "10:20 AM",
  },
  {
    id: "49",
    customerName: "Sakura Yamamoto",
    tableNumber: "6",
    totalAmount: 87001,
    status: "completed",
    items: 3,
    orderTime: "09:00 AM",
  },
  {
    id: "50",
    customerName: "Ester Mcleod",
    tableNumber: "5",
    totalAmount: 152106,
    status: "completed",
    items: 3,
    orderTime: "11:27 AM",
  },
];

interface OrderHistoryProps {
  orders?: Order[];
  onViewOrder?: (orderId: string) => void;
  onExportHistory?: (selectedOrders: string[]) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders = mockCompletedOrders,
  onViewOrder,
  onExportHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<SortableColumns>("id");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // Filter completed orders only and apply search
  const filteredOrders = useMemo((): Order[] => {
    let filtered = orders.filter((order: Order) => {
      const isCompleted = order.status === "completed";
      const matchesSearch =
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.tableNumber.includes(searchQuery) ||
        order.id.includes(searchQuery);
      return isCompleted && matchesSearch;
    });

    // Sort orders
    filtered.sort((a: Order, b: Order) => {
      let aValue: string | number = a[sortBy];
      let bValue: string | number = b[sortBy];

      if (sortBy === "totalAmount") {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchQuery, sortBy, sortOrder, orders]);

  // Pagination logic
  const totalPages: number = Math.ceil(filteredOrders.length / rowsPerPage);
  const startIndex: number = (currentPage - 1) * rowsPerPage;
  const paginatedOrders: Order[] = filteredOrders.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // Selection logic
  const handleSelectAll = (): void => {
    if (selectedOrders.length === paginatedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(paginatedOrders.map((order: Order) => order.id));
    }
  };

  const handleSelectOrder = (orderId: string): void => {
    setSelectedOrders((prev: string[]) =>
      prev.includes(orderId)
        ? prev.filter((id: string) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Status styling (only for completed status)
  const getStatusConfig = (): StatusConfig => {
    return {
      bg: "bg-success-50",
      text: "text-success-600",
      border: "border-success-200",
      icon: FiCheck,
      label: "Completed",
    };
  };

  const handleSort = (column: SortableColumns): void => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handleExportSelected = (): void => {
    if (onExportHistory) {
      onExportHistory(selectedOrders);
    }
    setSelectedOrders([]);
  };

  const handleRowsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <AdminLayout>
      <div
        className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden !mt-[170px]"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                Order History
              </h1>
              <p className="text-neutral-500 mt-1">
                Total {filteredOrders.length} completed orders
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search customer name, table, or order ID"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                />
              </div>

              {/* Export Button */}
              <div className="flex gap-2">
                <motion.button
                  onClick={() => onExportHistory && onExportHistory([])}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiDownload className="w-4 h-4" />
                  <span>Export All</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedOrders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="px-6 py-3 bg-primary-50 border-b border-neutral-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-primary-700">
                  {selectedOrders.length} orders selected
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportSelected}
                    className="px-3 py-1.5 text-sm bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors flex items-center gap-1"
                  >
                    <FiDownload className="w-3 h-3" />
                    Export Selected
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="overflow-x-auto">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Table */}
              <table className="w-full table-fixed">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="w-12 px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedOrders.length === paginatedOrders.length &&
                          paginatedOrders.length > 0
                        }
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                    </th>
                    <th
                      className="w-24 px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center gap-1">
                        Order ID
                        <FiChevronDown
                          className={`w-3 h-3 transition-transform ${
                            sortBy === "id" && sortOrder === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </th>
                    <th
                      className="w-48 px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                      onClick={() => handleSort("customerName")}
                    >
                      <div className="flex items-center gap-1">
                        Customer
                        <FiChevronDown
                          className={`w-3 h-3 transition-transform ${
                            sortBy === "customerName" && sortOrder === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </th>
                    <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Table
                    </th>
                    <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Items
                    </th>
                    <th
                      className="w-32 px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider cursor-pointer hover:bg-neutral-100 transition-colors"
                      onClick={() => handleSort("totalAmount")}
                    >
                      <div className="flex items-center gap-1">
                        Total
                        <FiChevronDown
                          className={`w-3 h-3 transition-transform ${
                            sortBy === "totalAmount" && sortOrder === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </div>
                    </th>
                    <th className="w-32 px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                      Completed
                    </th>
                  </tr>
                </thead>
              </table>

              {/* Scrollable Body */}
              <div
                className="overflow-y-auto border-b border-neutral-200"
                style={{ height: "calc(100vh - 420px)" }}
              >
                <table className="w-full table-fixed">
                  <tbody className="divide-y divide-neutral-200">
                    <AnimatePresence>
                      {paginatedOrders.map((order: Order, index: number) => {
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
                            <td className="w-12 px-6 py-4">
                              <input
                                type="checkbox"
                                checked={selectedOrders.includes(order.id)}
                                onChange={() => handleSelectOrder(order.id)}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                              />
                            </td>
                            <td className="w-24 px-6 py-4 text-sm font-medium text-neutral-900">
                              #{order.id}
                            </td>
                            <td className="w-48 px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-neutral-900 truncate">
                                  {order.customerName}
                                </div>
                                <div className="text-xs text-neutral-500">
                                  Ordered: {order.orderTime}
                                </div>
                              </div>
                            </td>
                            <td className="w-20 px-6 py-4 text-sm text-neutral-900">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                                Table {order.tableNumber}
                              </span>
                            </td>
                            <td className="w-20 px-6 py-4 text-sm text-neutral-500">
                              {order.items} items
                            </td>
                            <td className="w-32 px-6 py-4 text-sm font-medium text-neutral-900">
                              <div className="truncate">
                                {formatToIDR(order.totalAmount)}
                              </div>
                            </td>
                            <td className="w-32 px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                              >
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>

                {/* Empty State */}
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12">
                    <FiArchive className="mx-auto h-12 w-12 text-neutral-400" />
                    <h3 className="mt-2 text-sm font-medium text-neutral-900">
                      No completed orders found
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {searchQuery
                        ? "Try adjusting your search terms"
                        : "Completed orders will appear here"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-500">
              {selectedOrders.length} of {filteredOrders.length} selected
            </span>
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
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <motion.button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HiChevronLeft className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
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
    </AdminLayout>
  );
};

export default OrderHistory;
