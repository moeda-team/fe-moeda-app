import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { HiShoppingCart } from "react-icons/hi2";
import { useRouter } from "next/router";
import { getStatusConfig } from "@/utils/statusConfig";
import OrderCard from "@/components/ui/OrderCard";

// Types
interface OrderProduct {
  productId: string;
  type: "hot" | "iced";
  size: "regular" | "large";
  iceCube: "regular" | "less" | "more";
  sweet: "regular" | "less";
  note?: string;
  quantity: number;
  basePrice: number;
  imageUrl: string;
  status: "preparing" | "ready" | "completed" | "cancelled";
}

const OrderList: React.FC = () => {
  const router = useRouter();
  const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);

  useEffect(() => {
    // Mock data for demonstration - replace with actual API call
    const mockOrders: OrderProduct[] = [
      {
        productId: "1",
        type: "iced",
        size: "large",
        iceCube: "regular",
        sweet: "less",
        quantity: 2,
        basePrice: 25000,
        imageUrl: "/api/placeholder/80/80",
        status: "preparing",
      },
      {
        productId: "2",
        type: "hot",
        size: "regular",
        iceCube: "regular",
        sweet: "regular",
        quantity: 1,
        basePrice: 22000,
        imageUrl: "/api/placeholder/80/80",
        status: "ready",
      },
      {
        productId: "3",
        type: "iced",
        size: "large",
        iceCube: "more",
        sweet: "regular",
        quantity: 1,
        basePrice: 28000,
        imageUrl: "/api/placeholder/80/80",
        status: "completed",
      },
      {
        productId: "4",
        type: "hot",
        size: "regular",
        iceCube: "regular",
        sweet: "less",
        quantity: 3,
        basePrice: 22000,
        imageUrl: "/api/placeholder/80/80",
        status: "cancelled",
      },
    ];
    setOrderProducts(mockOrders);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-primary-500 text-white px-4 py-6 relative"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <motion.button
            onClick={() => router.back()}
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-500 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoArrowBack size={20} />
          </motion.button>

          <motion.h1
            className="text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Order List
          </motion.h1>

          <motion.div
            className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-500 relative"
            whileHover={{ scale: 1.05 }}
          >
            <HiShoppingCart size={20} />
            <motion.span
              className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white rounded-full text-xs flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
            >
              {orderProducts.length}
            </motion.span>
          </motion.div>
        </div>
      </motion.div>

      {/* Order Items */}
      <div className="px-4 py-6">
        <AnimatePresence>
          {orderProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 text-center"
            >
              <HiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No orders found
              </h3>
              <p className="text-gray-400">
                Your order history will appear here
              </p>
            </motion.div>
          ) : (
            orderProducts.map((product, index) => (
              <OrderCard {...product} key={index} />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderList;
