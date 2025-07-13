import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { RiFileList3Line } from "react-icons/ri";
import { useRouter } from "next/router";
import nookies from "nookies";

const FloatingOrder = () => {
  const router = useRouter();
  const { pathname } = router;
  const [orderId, setOrderId] = React.useState<string | null>(null);

  useEffect(() => {
    const storedOrderId = nookies.get(null, "orderId").orderId;
    if (storedOrderId) {
      setOrderId(storedOrderId);
    }
  }, []);

  if (
    "/cart" === pathname ||
    "/order" === pathname ||
    "/order-list" === pathname ||
    "/order-detail" === pathname ||
    "/admin-active-order" === pathname ||
    "/admin-cashier-menu" === pathname ||
    "/admin-cashflow" === pathname ||
    "/admin-order-history" === pathname
  ) {
    return null;
  }

  if (!orderId) {
    return null;
  }

  return (
    <div className="fixed right-8 bottom-8 z-50">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-full p-6 shadow-lg relative flex justify-center items-center"
        onClick={() => router.push("/order")}
      >
        <RiFileList3Line className="text-gray-700 text-4xl" size={28} />
      </motion.div>
    </div>
  );
};

export default FloatingOrder;
