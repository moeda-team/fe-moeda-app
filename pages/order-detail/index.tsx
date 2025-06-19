import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoPencil, IoCard } from "react-icons/io5";
import { FiArrowLeft } from "react-icons/fi";
import { formatToIDR } from "@/utils/formatCurrency";
import { useRouter } from "next/router";
import { RiFileList3Line } from "react-icons/ri";
import { OUTLET_ID } from "@/services";
import { concat, set } from "lodash";
import { toast } from "react-toastify";
import axios from "axios";
import { usePayment } from "@/contex/paymentContex";

// Types
interface CartItem {
  name: string;
  type: string;
  size: string;
  iceCube: string;
  sweet: string;
  note: string;
  quantity: number;
  id: string;
  price: number;
  img: string;
  addOns: string;
  spicyLevel: string;
}

interface Customer {
  tableNumber: string;
  name: string;
}

const OrderDetail: React.FC = () => {
  const { setPaymentNumber, setPaymentMethod, setTotal } = usePayment();
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer>({
    tableNumber: "0",
    name: "Customer Name",
  });
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const [tempCustomer, setTempCustomer] = useState<Customer>(customer);
  const [paymentMethodSelect, setPaymentMethodSelect] =
    useState<string>("cash");

  // Load cart data from localStorage on component mount
  useEffect(() => {
    const cartData = localStorage.getItem("cart");
    if (cartData) {
      try {
        const parsedCart: CartItem[] = JSON.parse(cartData);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error parsing cart data:", error);
      }
    }
  }, []);

  // Calculate totals
  const calculateSubtotal = (): number => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const subtotal: number = calculateSubtotal();
  const tax: number = Math.round(subtotal * 0.1); // 10% tax
  const serviceFee: number = 500;
  const beforeRounding: number = subtotal + tax + serviceFee;

  // Calculate rounding UP to nearest 100
  const roundedAmount: number = Math.ceil(beforeRounding / 100) * 100; // Round UP to nearest 100
  const roundingAdjustment: number = roundedAmount - beforeRounding;
  const paymentAmount: number = roundedAmount;

  const handleCustomerEdit = (): void => {
    setTempCustomer(customer);
    setShowCustomerModal(true);
  };

  const handleCustomerSave = (): void => {
    setCustomer(tempCustomer);
    setShowCustomerModal(false);
  };

  const handleCustomerCancel = (): void => {
    setTempCustomer(customer);
    setShowCustomerModal(false);
  };

  const getProductName = (item: CartItem): string => {
    // Convert id to readable name
    const name = item.id
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
    return name.replace(/\d+/g, "").trim();
  };

  const handleInputChange = (field: keyof Customer, value: string): void => {
    setTempCustomer((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onPayOrder = (): void => {
    if (customer.tableNumber === "0") {
      setShowCustomerModal(true);
      return;
    }
    let payload = {
      outletId: OUTLET_ID,
      transactionType: "dine-in",
      tableNumber: Number(customer.tableNumber),
      paymentMethod: paymentMethodSelect,
      customerName: customer.name,
      discount: 0,
      additionalNote: "",
      cart: cartItems.map((item: CartItem) => {
        const addOn = [
          item.addOns,
          item.spicyLevel,
          item.sweet,
          item.iceCube,
          item.size,
          item.type,
        ]
          .filter(Boolean)
          .join(", ");
        return {
          menuId: item.id,
          menuName: item.name,
          quantity: item.quantity,
          price: Number(item.price),
          subTotal: Number(item.quantity * item.price),
          addOn: addOn,
          note: item.note,
        };
      }),
    };

    try {
      axios
        .post(process.env.NEXT_PUBLIC_API + "/transactions/main", payload)
        .then((res) => {
          if (res.data.data) {
            setPaymentMethod(res.data.data.paymentMethod);
            setPaymentNumber(res.data.data.paymentNumber);
            setTotal(res.data.data.total);
            toast.success("Berhasil melakukan pemesanan", {
              position: "top-center",
            });
            localStorage.removeItem("cart");
            if (res.data.data.paymentMethod === "cash") {
              router.push("/feedback");
            } else {
              router.push("/payment");
            }
          } else {
            toast.error("Gagal melakukan pemesanan", {
              position: "top-center",
            });
          }
        })
        .catch((err) => {
          toast.error("Gagal melakukan pemesanan", {
            position: "top-center",
          });
        });
    } catch (error) {
      console.error(error);
      toast.error("Gagal melakukan pemesanan", {
        position: "top-center",
      });
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        className="bg-primary-500 text-white px-4 py-6"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-full p-3 shadow-lg"
            onClick={() => router.back()}
          >
            <FiArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.button>
          <h1 className="text-xl font-semibold">Order Detail</h1>
          <div className="relative">
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="bg-white rounded-full p-3 shadow-lg relative"
              onClick={() => router.push("/order")}
            >
              <RiFileList3Line className="w-5 h-5 text-gray-700" />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div
        className="px-4 mt-4 pb-10 overflow-y-auto"
        style={{ height: "calc(100vh - 92px - 282px)" }}
      >
        {/* Customer Info */}
        <motion.div
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-warning-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {customer.tableNumber}
                </span>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Customer</p>
                <p className="font-semibold text-neutral-500">
                  {customer.name}
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleCustomerEdit}
              className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              type="button"
            >
              <IoPencil className="w-5 h-5 text-white" />
            </motion.button>
          </div>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <IoCard className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-neutral-500">Payment Details</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">
                Subtotal ({cartItems.length} menu)
              </span>
              <span className="font-medium">{formatToIDR(subtotal)}</span>
            </div>

            {cartItems.map((item: CartItem, index: number) => (
              <motion.div
                key={index}
                className="flex justify-between text-sm"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <span className="text-gray-600">
                  {item.quantity}x {getProductName(item)}
                </span>
                <span>{formatToIDR(item.price)}</span>
              </motion.div>
            ))}

            <motion.div
              className="border-t pt-3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatToIDR(subtotal)}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          className="bg-white rounded-2xl p-4 mb-6 shadow-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <IoCard className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-neutral-500">
              Select Payment Method
            </h2>
          </div>

          <div className="space-y-2">
            <motion.div
              className={`flex items-center justify-between p-3 border-2 border-primary-500 rounded-lg ${
                paymentMethodSelect === "qris"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-500"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethodSelect("qris")}
            >
              <div className="text-2xl font-bold">QRIS</div>
            </motion.div>
            <motion.div
              className={`flex items-center justify-between p-3 border-2 border-primary-500 rounded-lg ${
                paymentMethodSelect === "cash"
                  ? "bg-primary-500 text-white"
                  : "text-neutral-500"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPaymentMethodSelect("cash")}
            >
              <div className="text-2xl font-bold">Cash</div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Payment Button */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {/* Payment Summary */}
        {/* Payment Summary */}
        <motion.div
          className="bg-white rounded-2xl mb-2 shadow-sm"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-medium">{formatToIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatToIDR(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span>{formatToIDR(serviceFee)}</span>
            </div>

            {/* Add Rounding Section */}
            <div className="flex justify-between">
              <span className="text-gray-600">Rounding</span>
              <span>{formatToIDR(roundingAdjustment)}</span>
            </div>

            <motion.div
              className="border-t pt-3"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex justify-between font-semibold text-lg">
                <span>Amount</span>
                <span>{formatToIDR(paymentAmount)}</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.button
          className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 disabled:bg-neutral-400"
          whileHover={{ scale: 1.02, backgroundColor: "#225049" }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400 }}
          type="button"
          disabled={cartItems.length === 0}
          onClick={onPayOrder}
        >
          <IoCard className="w-5 h-5" />
          <span>Payment Now</span>
        </motion.button>
      </motion.div>

      {/* Customer Edit Modal */}
      <AnimatePresence>
        {showCustomerModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-neutral-500">
                Edit Customer
              </h3>

              <div className="space-y-4">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Table Number
                  </label>
                  <input
                    type="number"
                    value={tempCustomer.tableNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("tableNumber", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter table number"
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    value={tempCustomer.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter customer name"
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
                  onClick={handleCustomerCancel}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-neutral-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleCustomerSave}
                  className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                >
                  Save
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrderDetail;
