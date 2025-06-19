// components/QrisPayment.js
"use client";
// import QRCode from "qrcode";
import useCountdown from "@/hooks/useCountdown";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { usePayment } from "@/contex/paymentContex";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";

export default function QrisPayment() {
  const { paymentNumber, paymentMethod, total } = usePayment();
  const [paymentResponse, setPaymentResponse] = useState<any>({});
  const router = useRouter();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const { minutes, seconds, isFinished } = useCountdown(
    paymentResponse?.data?.expiry_time
      ? moment(
          paymentResponse?.data?.expiry_time,
          "YYYY-MM-DD HH:mm:ss"
        ).format("m:ss")
      : "4:00"
  );

  useEffect(() => {
    if (isFinished) {
      toast.error("Payment Expired");
      router.push("/cart");
    }
  }, [isFinished]);

  useEffect(() => {
    if (Boolean(paymentMethod) && Boolean(paymentNumber) && Boolean(total)) {
      const payload = {
        paymentType: paymentMethod,
        transactionDetails: {
          orderId: paymentNumber,
          grossAmount: total,
        },
      };
      axios
        .post(`${process.env.NEXT_PUBLIC_API}/transactions/payments`, payload)
        .then((res) => {
          if (res.data) {
            setPaymentResponse(res.data);
          }
        });
    }
  }, [paymentMethod, paymentNumber, total]);

  useEffect(() => {
    if (Array.isArray(paymentResponse?.data?.actions)) {
      setQrCodeUrl(paymentResponse?.data?.actions[0].url);
    }
  }, [paymentResponse?.data?.actions]);

  useEffect(() => {
    const fetchData = async () => {
      const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "";
      const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "";

      const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;
      axios
        .get(
          `${process.env.NEXT_PUBLIC_API}/transactions/payments/status/${paymentNumber}`,
          {
            headers: {
              Authorization: basicAuth,
            },
          }
        )
        .then((res) => {
          if (res.data.data.status === "completed") {
            router.push("/feedback");
          }
        });
    };

    // Initial fetch
    fetchData();

    // Set up interval
    const interval = setInterval(() => {
      fetchData();
    }, 5000); // 3 seconds

    // Cleanup
    return () => clearInterval(interval);
  }, []);

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
