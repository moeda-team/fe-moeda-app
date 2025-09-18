import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCheck, FiClock, FiX, FiRefreshCw } from "react-icons/fi";
import { HiArrowRight, HiChevronLeft, HiChevronRight, HiOutlineChevronRight } from "react-icons/hi";
import { formatToIDR } from "@/utils/formatCurrency";
import { AdminLayout } from "@/components/layout";
import { useActiveOrderTableMoving } from "@/swr/get/activeOrder";
import { debounce } from "lodash";
import moment from "moment";
import OrderProgress from "@/components/ui/FloatingOrder/OrderProgress";
import DetailPopUp from "./DetailPopup";

// Types
interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  totalAmount: number;
  status: "preparation" | "ready" | "completed" | "failed" | "pending";
  items: number;
  orderTime: string;
  logTableMove: {
    id:string;
    note:string;
    tableNumber:string;
  }[];
  subTransactions: SubTransaction[];
}

interface SubTransaction {
  id: string;
  menuName: string;
  status: "preparation" | "completed";
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
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [productDetail, setProductDetail] = useState<any>({});
  const { activeOrder } = useActiveOrderTableMoving(
    currentPage,
    rowsPerPage,
    searchQuery,
    true
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
        tableNumber: String(tx.tableNumber),
        totalAmount: parseInt(tx.total, 10),
        status: tx.status,
        logTableMove: tx.logTableMove,
        subTransactions: tx.subTransactions,
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

  return (
    <AdminLayout>
      <div
        className="bg-nuetral-100 rounded-xl shadow-sm border border-neutral-200 overflow-auto !mt-[170px]"
        style={{ height: "calc(100vh - 180px)" }}
      >
        {/* Header */}
        <div className="lg:p-6 p-2 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="lg:text-2xl text-xl font-bold text-neutral-900">
                Recently moving
              </h1>
              <p className="text-neutral-500 mt-1">
                Total {activeOrder?.transactions?.length} orders
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search name or table number"
                  onChange={handleSearchChange}
                  className="pl-10 pr-4 py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-80 transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-2 m-2 ">
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
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`hover:bg-neutral-200 transition-colors duration-150 bg-white p-3 rounded-lg cursor-pointer ${
                        selectedOrders.includes(order.id)
                          ? "bg-primary-50"
                          : ""
                      }`}
                      onClick={() => {
                        setOpenPopupOrder(true)
                        setProductDetail(order)
                      }}
                    >
                      <div className="flex gap-2 items-center">
                        <div className="flex justify-center items-center bg-orange-600 text-white p-4 w-14 h-14 rounded-full font-semibold">{order.tableNumber}</div>
                        <div className="flex flex-col gap-1">
                          <div className="font-semibold">{order.customerName}</div>
                          <div className="flex gap-2 items-center">
                            {
                              order.logTableMove?.map((trx, i) => (
                                <React.Fragment key={trx.id ?? i}>
                                  <div className="font-semibold bg-neutral-400 py-0.5 rounded-lg text-xs text-center w-20">
                                    Table {trx.tableNumber}
                                  </div>

                                  {/* Tampilkan panah kecuali di item terakhir */}
                                  {i < order.logTableMove.length - 1 && (
                                    <HiArrowRight className="text-gray-600 w-4 h-4" />
                                  )}
                                </React.Fragment>
                              ))
                            }

                            {
                              order.logTableMove.length === 0 ?
                                <div className="font-semibold bg-neutral-400 py-0.5 rounded-lg text-xs text-center w-20">
                                  Table {order.tableNumber}
                                </div>
                              :""
                            }
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <OrderProgress subTransactions={order.subTransactions} />
                      </div>
                    </motion.div>
                  );
                }
              )}
          </AnimatePresence>
        </div>
      </div>
      
      {openPopupOrder && (
        <DetailPopUp
          productDetail={productDetail}
          onClose={() => {
            setOpenPopupOrder(false);
            setProductDetail({});
          }}
          isOpen={openPopupOrder}
        />
      )}
    </AdminLayout>
  );
};

export default History;
