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
import { CartCard } from "@/components/ui";
import { formatToIDR } from "@/utils/formatCurrency";

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
  console.log({ cartProducts });

  // Calculate totals
  const subTotal = _.sumBy(
    cartProducts,
    (product) => product.basePrice * product.quantity
  );
  const totalAmount = subTotal;

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

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartProducts(JSON.parse(storedCart));
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
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
              <CartCard
                index={index}
                product={product}
                key={product.productId}
                removeProduct={removeProduct}
                updateQuantity={updateQuantity}
              />
            ))
          )}
        </AnimatePresence>

        {/* Payment Button */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="flex justify-between pb-2">
            <span className="font-bold text-lg">Amount</span>
            <span className="font-bold text-lg">
              {formatToIDR(totalAmount)}
            </span>
          </div>
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
