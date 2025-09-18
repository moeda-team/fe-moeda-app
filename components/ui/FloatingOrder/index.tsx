import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RiFileList3Line } from "react-icons/ri";
import { useRouter } from "next/router";
import nookies from "nookies";
import axios from "axios";
import Slider from "react-slick";
import OrderProgress from "./OrderProgress";
import Image from "next/image";

const FloatingOrder = () => {
  const router = useRouter();
  const { pathname } = router;
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderIds, setOrderIds] = useState<string[]>([]);
  const [orderList, setOrderList] = useState<any[]>([]);

  // Ambil cookies pertama kali
  useEffect(() => {
    const cookies = nookies.get(null);

    if (cookies.orderId) {
      setOrderId(cookies.orderId);
    }

    if (cookies.orderIds) {
      try {
        const arrIds = JSON.parse(cookies.orderIds);
        if (Array.isArray(arrIds)) {
          setOrderIds(arrIds);
        }
      } catch (err) {
        console.error("Invalid orderIds cookie:", err);
      }
    }
  }, []);

  // Fetch status order
  useEffect(() => {
    if (orderIds.length === 0) return;

    const fetchData = async () => {
      const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "";
      const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "";
      const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API}/transactions/main/check/status`,
          { orderIds },
          {
            headers: {
              Authorization: basicAuth,
            },
          }
        );
        setOrderList(res.data.data || []);
      } catch (err) {
        console.error("Error fetching status:", err);
      }
    };

    fetchData();
  }, [orderIds]);

  // Kondisi hidden
  const hiddenRoutes = [
    "/login",
    "/cart",
    "/order",
    "/order-list",
    "/order-detail",
    "/admin-active-order",
    "/admin-cashier-menu",
    "/admin-cashflow",
    "/admin-order-history",
    "/admin-table-moving",
  ];

  if (hiddenRoutes.includes(pathname) || !orderId) {
    return null;
  }

  // Slick carousel settings
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="fixed bottom-8 z-50 w-full px-8">
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="bg-white rounded-lg p-4 shadow-lg relative flex flex-col justify-center items-center w-full"
      >
        <div className="w-full">
          {orderList.length > 0 ? (
            <Slider {...settings}>
              {orderList.map((order, idx) => (
                <div
                  key={idx}
                  className="cursor-pointer"
                  onClick={() => router.push(`/order?orderId=${order.id}`)}
                >
                  <div className="flex space-x-2 items-center">
                    <div className="relative w-14 h-14">
                      <Image
                        className="p-1 rounded-md"
                        src={order.subTransactions.length > 0 ? order.subTransactions[0]?.menu.img : "/images/product-image.webp"}
                        alt="Food"
                        fill
                        style={{
                          objectFit: "contain",
                        }}
                        priority
                      />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">{order.customerName}</div>
                      <div className="text-sm text-gray-500">
                        {order.paymentNumber}
                      </div>
                    </div>
                  </div>
                  <OrderProgress subTransactions={order.subTransactions} />
                </div>
              ))}
            </Slider>
          ) : (
            <div className="flex items-center space-x-2">
              <RiFileList3Line className="text-gray-700 text-2xl" />
              <span className="text-gray-600">No active orders</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FloatingOrder;
