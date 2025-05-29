import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiTrash2,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import _ from "lodash";
import { useRouter } from "next/router";
import { IoCard } from "react-icons/io5";
import { RiFileList3Line } from "react-icons/ri";

// Types
interface CartProduct {
  productId: string;
  type: "hot" | "iced";
  size: "regular" | "large";
  iceCube: "regular" | "less" | "more";
  sweet: "regular" | "less";
  note?: string;
  quantity: number;
  basePrice: number;
  imageUrl: string;
}

const MatchaCartUI: React.FC = () => {
  const router = useRouter();

  const [cartProducts, setCartProducts] = useState<CartProduct[]>([]);

  // Calculate totals
  const subTotal = _.sumBy(
    cartProducts,
    (product) => product.basePrice * product.quantity
  );
  const tax = Math.floor(subTotal * 0.1);
  const serviceFee = 500;
  const totalAmount = subTotal + tax + serviceFee;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `Rp.${amount.toLocaleString("id-ID")}`;
  };

  // Update quantity and localStorage
  const updateQuantity = (
    productToUpdate: CartProduct,
    newQuantity: number
  ) => {
    if (newQuantity <= 0) {
      removeProduct(productToUpdate);
      return;
    }
    const updatedProducts = cartProducts.map((product) => {
      // Match by all properties to find the exact product
      if (
        product.basePrice === productToUpdate.basePrice &&
        product.iceCube === productToUpdate.iceCube &&
        product.imageUrl === productToUpdate.imageUrl &&
        product.note === productToUpdate.note &&
        product.productId === productToUpdate.productId &&
        product.quantity === productToUpdate.quantity &&
        product.size === productToUpdate.size &&
        product.sweet === productToUpdate.sweet &&
        product.type === productToUpdate.type
      ) {
        return { ...product, quantity: newQuantity };
      }
      return product;
    });
    setCartProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  // Remove product by matching all properties and update localStorage
  const removeProduct = (productToRemove: CartProduct) => {
    const updatedProducts = cartProducts.filter((product) => {
      return !(
        product.basePrice === productToRemove.basePrice &&
        product.iceCube === productToRemove.iceCube &&
        product.imageUrl === productToRemove.imageUrl &&
        product.note === productToRemove.note &&
        product.productId === productToRemove.productId &&
        product.quantity === productToRemove.quantity &&
        product.size === productToRemove.size &&
        product.sweet === productToRemove.sweet &&
        product.type === productToRemove.type
      );
    });
    setCartProducts(updatedProducts);
    localStorage.setItem("cart", JSON.stringify(updatedProducts));
  };

  // Get option display text
  const getOptionText = (type: string, value: string): string => {
    const optionMap: Record<string, Record<string, string>> = {
      type: { hot: "Hot", iced: "Iced" },
      size: { regular: "Regular", large: "Large" },
      iceCube: { regular: "Ice", less: "Less Ice", more: "More Ice" },
      sweet: { regular: "Regular", less: "Less Sugar" },
    };
    return optionMap[type]?.[value] || value;
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartProducts(JSON.parse(storedCart));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary-500 text-white px-4 py-6 rounded-b-3xl">
        <div className="flex items-center justify-between mx-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white rounded-full p-3 shadow-lg"
            onClick={() => router.push("/")}
          >
            <FiArrowLeft className="w-5 h-5 text-gray-700" />
          </motion.button>

          <h1 className="text-white text-xl font-semibold">Cart</h1>

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
      </div>

      {/* Cart Items */}
      <div className="mx-auto px-4 mt-4 pb-28">
        <AnimatePresence>
          {cartProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 text-center"
            >
              <FiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-400">
                Add some delicious matcha lattes to get started!
              </p>
            </motion.div>
          ) : (
            cartProducts.map((product, index) => (
              <motion.div
                key={product.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-900 rounded-xl flex-shrink-0 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt="Matcha Latte"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        Matcha Latte
                      </h3>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => removeProduct(product)}
                        className="bg-danger-50 p-2 rounded-lg"
                      >
                        <FiTrash2 className="w-4 h-4 text-danger-500" />
                      </motion.button>
                    </div>

                    {/* Options */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        {getOptionText("size", product.size)}
                      </span>
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        {getOptionText("iceCube", product.iceCube)}
                      </span>
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                        {getOptionText("sweet", product.sweet)}
                      </span>
                      {product.iceCube === "more" && (
                        <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          More Ice
                        </span>
                      )}
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">
                        {formatCurrency(product.basePrice)}
                      </span>

                      <div className="flex items-center gap-3">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(product, product.quantity - 1)
                          }
                          className="bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600"
                        >
                          <FiMinus className="w-4 h-4" />
                        </motion.button>

                        <span className="font-semibold text-gray-900 min-w-[20px] text-center">
                          {product.quantity}
                        </span>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            updateQuantity(product, product.quantity + 1)
                          }
                          className="bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600"
                        >
                          <FiPlus className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 mt-6 shadow-sm"
        >
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Sub Total</span>
              <span className="font-semibold">{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="font-semibold">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Service Fee</span>
              <span className="font-semibold">
                {formatCurrency(serviceFee)}
              </span>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between">
              <span className="font-bold text-lg">Amount</span>
              <span className="font-bold text-lg">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Payment Button */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <motion.button
            disabled={cartProducts.length === 0}
            className="w-full bg-primary-500 text-white py-4 rounded-2xl font-semibold flex items-center justify-center space-x-2 disabled:bg-neutral-400"
            whileHover={{ scale: 1.02, backgroundColor: "#225049" }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400 }}
            type="button"
            onClick={() => {
              router.push("/order-detail");
            }}
          >
            <IoCard className="w-5 h-5" />
            <span>Payment Now</span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchaCartUI;
