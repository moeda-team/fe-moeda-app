import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import { API_URL } from "@/services";
import { fetcher } from "@/swr/fetcher";
import { FaTimes } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import OrderProgress from "@/components/ui/FloatingOrder/OrderProgress";
import { FiShoppingCart } from "react-icons/fi";
import OrderCard from "@/components/ui/OrderCard";

interface ModalHeaderProps {
  onClose: () => void;
}
interface DetailPopUpProps {
  onClose: () => void;
  productDetail: any;
  isOpen: boolean;
}

// Animation variants
const modalVariants = {
  hidden: {
    y: "100%",
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 500,
      duration: 0.3,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Modal Header Component
const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => (
  <div className="sticky top-0 bg-white rounded-t-2xl border-b px-6 py-4 flex items-center justify-between">
    <motion.div
      className="w-12 h-1 bg-gray-300 rounded-full mx-auto"
      initial={{ width: 0 }}
      animate={{ width: 48 }}
      transition={{ delay: 0.2 }}
    />
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

// Order Form Component
const DetailPopUp: React.FC<DetailPopUpProps> = ({ onClose, productDetail, isOpen = false }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
        
        {/* body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.05 }}
          className={`transition-colors duration-150 bg-white p-3 rounded-lg cursor-pointer`}
        >
          <div className="flex gap-2 items-center">
            <div className="flex justify-center items-center bg-orange-600 text-white p-4 w-14 h-14 rounded-full font-semibold">{productDetail.tableNumber}</div>
            <div className="flex flex-col gap-1">
              <div className="font-semibold">{productDetail.customerName}</div>
              <div className="flex gap-2 items-center">
                {
                  productDetail.logTableMove?.map((trx:any, i:any) => (
                    <React.Fragment key={trx.id ?? i}>
                      <div className="font-semibold bg-neutral-400 py-0.5 rounded-lg text-xs text-center w-20">
                        Table {trx.tableNumber}
                      </div>

                      {/* Tampilkan panah kecuali di item terakhir */}
                      {i < productDetail.logTableMove.length - 1 && (
                        <HiArrowRight className="text-gray-600 w-4 h-4" />
                      )}
                    </React.Fragment>
                  ))
                }

                {
                  productDetail.logTableMove.length === 0 ?
                    <div className="font-semibold bg-neutral-400 py-0.5 rounded-lg text-xs text-center w-20">
                      Table {productDetail.tableNumber}
                    </div>
                  :""
                }
              </div>
            </div>
          </div>
          <div className="p-2">
            <OrderProgress subTransactions={productDetail.subTransactions} />
          </div>
        </motion.div>
        
        <div className="rounded-b-lg p-2 bg-white max-h-96 overflow-auto">
          <AnimatePresence>
            {Array.isArray(productDetail?.subTransactions) &&
            productDetail?.subTransactions.length === 0 ? (
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
              Array.isArray(productDetail?.subTransactions) &&
              productDetail?.subTransactions.map((product: any, index: number) => {
                const addOn: string[] = product?.addOn?.split(",") || [];
                return (
                  <OrderCard
                    product={{ ...product, addOn }}
                    index={index}
                    key={product.id ?? index}
                  />
                );
              })
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DetailPopUp;
