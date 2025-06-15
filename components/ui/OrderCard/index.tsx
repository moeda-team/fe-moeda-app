import React from "react";
import { motion } from "framer-motion";
import { getStatusConfig } from "@/utils/statusConfig";
import { formatToIDR } from "@/utils/formatCurrency";

interface OrderProduct {
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
  status: "preparing" | "ready" | "completed" | "cancelled";
}

const getOptionText = (type: string, value: string): string => {
  const optionMap: Record<string, Record<string, string>> = {
    type: { hot: "Hot", iced: "Iced" },
    size: { regular: "Regular", large: "Large" },
    iceCube: { regular: "Ice", less: "Less Ice", more: "More Ice" },
    sweet: { regular: "Regular", less: "Less Sugar" },
  };
  return optionMap[type]?.[value] || value;
};

const OrderCard = (product: OrderProduct, index: number) => {
  const statusConfig = getStatusConfig(product.status);

  return (
    <motion.div
      key={`${product.id}-${index}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm relative"
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <motion.div
          className="w-20 h-20 rounded-xl flex-shrink-0 overflow-hidden"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={product.img}
            alt="Matcha Latte"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkM4IDMyIDggNDggMjQgNDhIMjhWNDRIMjRDMTYgNDQgMTYgMzYgMjQgMzZIMjhWMzJIMjRaIiBmaWxsPSIjOTI5QUEyIi8+CjxwYXRoIGQ9Ik01NiAzMkg1MlYzNkg1NkM2NCAzNiA2NCA0NCA1NiA0NEg1MlY0OEg1NkM3MiA0OCA3MiAzMiA1NiAzMloiIGZpbGw9IiM5MjlBQTIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iIzkyOUFBMiIvPgo8L3N2Zz4K";
            }}
          />
        </motion.div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="mb-3">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">Matcha Latte</h3>
              {/* Status Badge */}
              <motion.div
                className={`${statusConfig.bgColor} px-3 py-1 rounded-full text-xs flex items-center gap-1`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <span className={`${statusConfig.textColor}`}>
                  {statusConfig.text}
                </span>
              </motion.div>
            </div>
            <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              {getOptionText("type", product.type)}
            </span>
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
          </div>

          {/* Price */}
          <div className="flex items-center w-full text-nowrap">
            <span className="font-bold text-lg text-gray-900">
              {formatToIDR(product.price * product.quantity)}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              ({formatToIDR(product.price)} each)
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
