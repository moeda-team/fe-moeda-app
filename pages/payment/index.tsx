// components/QrisPayment.js
"use client";
// import QRCode from "qrcode";
import useCountdown from "@/hooks/useCountdown";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { usePayment } from "@/contex/paymentContex";

export default function QrisPayment() {
  const { setPaymentNumber, setPaymentMethod, setTotal } = usePayment();
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const { minutes, seconds } = useCountdown("4:30");

  // useEffect(() => {
  //   // Generate QR code for demonstration
  //   const generateQRCode = async () => {
  //     try {
  //       const url = await QRCode.toDataURL("QRIS://DEMO_PAYMENT_04:30", {
  //         width: 300,
  //         margin: 1,
  //         color: {
  //           dark: "#000000",
  //           light: "#FFFFFF",
  //         },
  //       });
  //       setQrCodeUrl(url);
  //     } catch (err) {
  //       console.error("Error generating QR code:", err);
  //     }
  //   };

  //   generateQRCode();
  // }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <motion.div
        className="bg-primary-500 text-white px-4 py-6"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <motion.h1
            className="text-xl font-semibold mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Qris Payment
          </motion.h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-8">
        {/* QRIS Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <motion.div
            className="text-4xl font-bold text-neutral-500 tracking-wider"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            QRIS
          </motion.div>
        </motion.div>

        {/* QR Code Container */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
        >
          <div className="relative">
            {/* QR Code Frame */}
            <motion.div
              className="w-80 h-80 bg-white rounded-lg shadow-lg p-6 relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {/* Corner decorations with staggered animation */}
              <motion.div
                className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-warning-500 rounded-tl-lg"
                initial={{ opacity: 0, x: -10, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              ></motion.div>
              <motion.div
                className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-warning-500 rounded-tr-lg"
                initial={{ opacity: 0, x: 10, y: -10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              ></motion.div>
              <motion.div
                className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-warning-500 rounded-bl-lg"
                initial={{ opacity: 0, x: -10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.3, duration: 0.4 }}
              ></motion.div>
              <motion.div
                className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-warning-500 rounded-br-lg"
                initial={{ opacity: 0, x: 10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.2, duration: 0.4 }}
              ></motion.div>

              {/* QR Code */}
              <div className="w-full h-full flex items-center justify-center">
                {qrCodeUrl ? (
                  <motion.img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-60 h-60 object-contain"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
                  />
                ) : (
                  <motion.div
                    className="w-60 h-60 bg-gray-200 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  ></motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Payment Info */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.5 }}
        >
          <p className="text-lg text-neutral-500 font-medium">
            Payment of {minutes}:{seconds}
          </p>
        </motion.div>

        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 disabled:bg-neutral-400"
            whileHover={{ scale: 1.02, backgroundColor: "#225049" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
            type="button"
            onClick={() => {
              router.push("/feedback");
            }}
          >
            <span>Completed</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
