import React from "react";
import { motion } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import getOptionText from "@/utils/getTagTextOption";
import { formatToIDR } from "@/utils/formatCurrency";

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

interface CartCardProps {
  product: CartProduct;
  index: number;
  removeProduct: (product: CartProduct) => void;
  updateQuantity: (productToUpdate: CartProduct, newQuantity: number) => void;
}

const CartCard = ({
  product,
  index,
  removeProduct,
  updateQuantity,
}: CartCardProps) => {
  return (
    <div
      key={`${product.productId}-${index}`}
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-24 bg-gray-900 rounded-xl flex-shrink-0 overflow-hidden">
          <img
            src={product.imageUrl}
            alt="Matcha Latte"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-gray-900">Matcha Latte</h3>
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
        </div>
      </div>
      {/* Price and Quantity */}
      <div className="flex items-center justify-between">
        <span className="font-bold text-gray-900">
          {formatToIDR(product.basePrice)}
        </span>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => updateQuantity(product, product.quantity - 1)}
            className="bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600"
          >
            <FiMinus className="w-4 h-4" />
          </motion.button>

          <span className="font-semibold text-gray-900 min-w-[20px] text-center">
            {product.quantity}
          </span>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => updateQuantity(product, product.quantity + 1)}
            className="bg-primary-500 text-white rounded-full p-2 hover:bg-primary-600"
          >
            <FiPlus className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
