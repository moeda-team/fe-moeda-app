"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { FiShoppingCart } from "react-icons/fi";
import OrderProgress from "@/components/ui/FloatingOrder/OrderProgress";
import OrderCard from "@/components/ui/OrderCard";

interface ModalHeaderProps {
  onClose: () => void;
}

interface OrderProduct {
  id: string;
  menu: { img: string };
  menuName: string;
  status: "preparation" | "completed";
  quantity: number;
  price: number;
  addOn: string[];
  subTotal: number;
  total: number;
}

interface DetailPopUpProps {
  onClose: () => void;
  productDetail: Order;
  isOpen: boolean;
}

interface Order {
  id: string;
  customerName: string;
  tableNumber: string;
  totalAmount: number;
  status: "preparation" | "ready" | "completed" | "failed" | "pending";
  items: number;
  orderTime: string;
  logTableMove?: {
    id: string;
    note: string;
    tableNumber: string;
  }[];
  subTransactions?: SubTransaction[];
}

interface SubTransaction {
  id: string;
  menuName: string;
  status: "preparation" | "completed";
  addOn?: string;
  quantity?: number;
  price?: number;
  menu?: string;
  subTotal?: number;
  total?: number;
}

// Animation variants
const modalVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 500, duration: 0.3 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2 } },
};

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

// Modal Header Component
const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => (
  <div className="sticky top-0 bg-white rounded-t-2xl border-b px-6 py-4 flex items-center justify-between">
    <motion.div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.2 }} />
    <motion.button
      onClick={onClose}
      className="absolute right-4 text-gray-500 hover:text-gray-700 p-2"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaTimes />
    </motion.button>
  </div>
);

// DetailPopUp Component
const DetailPopUp: React.FC<DetailPopUpProps> = ({ onClose, productDetail, isOpen = false }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const tableMoves = productDetail?.logTableMove ?? [];
  const subTransactions = productDetail?.subTransactions ?? [];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModalHeader onClose={onClose} />

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.05 }}
          className="transition-colors duration-150 bg-white p-3 rounded-lg cursor-pointer"
        >
          <div className="flex gap-2 items-center">
            <div className="flex justify-center items-center bg-orange-600 text-white p-4 w-14 h-14 rounded-full font-semibold">
              {productDetail?.tableNumber}
            </div>

            <div className="flex flex-col gap-1">
              <div className="font-semibold">{productDetail?.customerName}</div>
              <div className="flex gap-2 items-center">
                {tableMoves.length > 0
                  ? tableMoves.map((trx, i) => (
                      <React.Fragment key={trx.id ?? i}>
                        <div className="font-semibold bg-neutral-400 py-0.5 rounded-lg text-xs text-center w-20">
                          Table {trx.tableNumber}
                        </div>
                        {i < tableMoves.length - 1 && <HiArrowRight className="text-gray-600 w-4 h-4" />}
                      </React.Fragment>
                    ))
                  : <div className="font-semibold bg-neutral-400 py-0.5 rounded-lg text-xs text-center w-20">Table {productDetail?.tableNumber}</div>}
              </div>
            </div>
          </div>

          <div className="p-2">
            <OrderProgress subTransactions={subTransactions} />
          </div>
        </motion.div>

        {/* Sub Transactions */}
        <div className="rounded-b-lg p-2 bg-white max-h-96 overflow-auto">
          <AnimatePresence>
            {subTransactions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 text-center"
              >
                <FiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
                <p className="text-gray-400">Your order history will appear here</p>
              </motion.div>
            ) : (
              subTransactions.map((product, index) => {
                const addOn: string[] = (product?.addOn ?? "").split(",");

                const orderProduct: OrderProduct = {
                  id: product.id,
                  menu: { img: "" }, // bisa diisi URL gambar jika ada
                  menuName: product.menuName,
                  status: product.status,
                  addOn,
                  quantity: product.quantity ?? 1,
                  price: product.price ?? 0,
                  subTotal: product.subTotal ?? 0,
                  total: product.total ?? 0,
                };

                return <OrderCard product={orderProduct} index={index} key={product.id ?? index} />;
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailPopUp;
