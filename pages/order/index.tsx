"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation"; // ✅ pakai App Router
import OrderCard from "@/components/ui/OrderCard";
import Image from "next/image";
import { useDetailOrder } from "@/swr/get/getOrder";
import nookies from "nookies";
import { formatToIDR } from "@/utils/formatCurrency";
import { BiChevronDown } from "react-icons/bi";
import axios from "axios";

interface Customer {
  tableNumberBefore: string;
  tableNumber: string;
  note: string;
}

interface CartProduct {
  name: string;
  id: string;
  type: "Hot" | "Ice";
  size: "Regular" | "Large";
  iceCube: "Less" | "Normal" | "More Ice" | "No Ice Cube";
  sweet: "Normal" | "Less Sugar";
  addOns: "Extra Cheese" | "Fried Egg" | "Crackers";
  spicyLevel: "Mild" | "Medium" | "Hot";
  note?: string;
  quantity: number;
  price: number;
  img: string;
}

const OrderList: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("orderId") ?? "";

  const [idOrder, setIdOrder] = useState<string>(orderIdParam);
  const { orderDetail } = useDetailOrder(idOrder);
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);

  useEffect(() => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      setCartItems(JSON.parse(cart));
    }

    // Ambil orderId dari cookie kalau ada
    const cookieOrderId = nookies.get().orderId;
    if (cookieOrderId) {
      setIdOrder(cookieOrderId);
    }
  }, []);

  // modal
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [customer, setCustomer] = useState<Customer>({
    tableNumber: "0",
    tableNumberBefore: "0",
    note: "",
  });
  const [tempCustomer, setTempCustomer] = useState<Customer>(customer);

  const handleInputChange = (field: keyof Customer, value: string): void => {
    setTempCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSwitchTable = async () => {
    if (!idOrder) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/transactions/main/table/${idOrder}`,
        {
          tableNumber: tempCustomer.tableNumber,
          note: tempCustomer.note,
        }
      );

      setCustomer(tempCustomer);
      setOpenPopupOrder(false);

    } catch (error: any) {
      console.error("Failed to switch table:", error.response?.data || error);
    } finally {
      setOpenPopupOrder(false);
    }
  };

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
          <Image
            onClick={() => router.push("/")}
            src="/logo.png"
            alt="Moeda Coffee Logo"
            width={44}
            height={44}
            className="object-contain relative z-50 cursor-pointer"
            priority
          />

          <motion.h1
            className="text-xl font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Order List
          </motion.h1>

          <motion.div
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-primary-500 relative"
            whileHover={{ scale: 1.05 }}
            onClick={() => router.push("/cart")}
          >
            <FiShoppingCart size={20} />
            {cartItems.length > 0 && (
              <motion.span
                className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white rounded-full text-xs flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                {cartItems.length}
              </motion.span>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Order Items */}
      <div className="px-4 py-6">
        <div className="rounded-t-lg p-2 bg-[#E35336] text-white flex justify-between gap-1">
          <div className="rounded-t-lg p-1 flex flex-col">
            <div className="flex gap-2">
              <div className="text-sm w-14">Name</div>
              <div className="text-sm">:</div>
              <div className="text-sm font-bold">{orderDetail?.customerName ?? "-"}</div>
            </div>
            <div className="flex gap-2">
              <div className="text-sm w-14">Total</div>
              <div className="text-sm">:</div>
              <div className="text-sm font-bold">{formatToIDR(orderDetail?.total ?? 0)}</div>
            </div>
          </div>
          <div className="rounded-t-lg p-1 flex flex-col">
            <div className="gap-1 text-right text-sm">Table</div>
            <div
              className="gap-1 text-right underline font-semibold cursor-pointer"
              title="Switch Table"
              onClick={() => {
                setTempCustomer({
                  note :"",
                  tableNumber : '1',
                  tableNumberBefore : orderDetail.tableNumber
                })
                setOpenPopupOrder(true)
              }}
            >
              #{customer.tableNumber !== '0' ? customer.tableNumber : orderDetail?.tableNumber ?? "-"}
            </div>
          </div>
        </div>

        <div className="rounded-b-lg p-2 bg-white">
          <AnimatePresence>
            {Array.isArray(orderDetail?.subTransactions) &&
            orderDetail?.subTransactions.length === 0 ? (
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
              Array.isArray(orderDetail?.subTransactions) &&
              orderDetail?.subTransactions.map((product: any, index: number) => {
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

        {/* Customer Switch Modal */}
        <AnimatePresence>
          {openPopupOrder && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 w-full max-w-lg flex flex-col gap-2"
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 50 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="text-lg font-semibold text-neutral-500 text-center">
                  Switch Table
                </div>
                <div className="text-xs text-center">
                  Please find an empty table to transfer your order.
                </div>

                <div className="space-y-4">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex gap-2 ">
                      <div className="flex flex-col w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Starting table
                        </label>
                        <input
                          className="w-full px-3 pr-10 py-2 border bg-neutral-100 border-gray-300 rounded-lg focus:outline-none"
                          value={tempCustomer.tableNumberBefore}
                          readOnly
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Moving table
                        </label>
                        <div className="relative flex items-center w-full">
                          <select
                            className="w-full px-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
                            onChange={(e) =>
                              handleInputChange("tableNumber", e.target.value)
                            }
                            value={tempCustomer.tableNumber}
                          >
                            {Array.from({ length: 30 }, (_, i) => (
                              <option key={i} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                          <BiChevronDown
                            size={20}
                            className="absolute right-3 pointer-events-none text-gray-500"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Note
                    </label>
                    <textarea
                      value={tempCustomer.note}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        handleInputChange("note", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
                      placeholder="Input Note"
                    />
                  </motion.div>
                </div>

                <motion.div
                  className="flex space-x-3 mt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => setOpenPopupOrder(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-neutral-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      handleSwitchTable()
                    }}
                    className={`
                      flex-1 px-4 py-2  text-white rounded-lg 
                      ${customer.tableNumberBefore === tempCustomer.tableNumber ? 'bg-primary-200' : 'bg-primary-500 hover:bg-primary-600'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={customer.tableNumberBefore === tempCustomer.tableNumber}
                  >
                    Switch
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default OrderList;
