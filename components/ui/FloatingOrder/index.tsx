import React from "react";
import { motion } from "framer-motion";
import { RiFileList3Line } from "react-icons/ri";
import { useRouter } from "next/router";

const FloatingOrder = () => {
  const router = useRouter();
  const { pathname } = router;

  if (
    "/cart" === pathname ||
    "/order" === pathname ||
    "/order-detail" === pathname
  ) {
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
