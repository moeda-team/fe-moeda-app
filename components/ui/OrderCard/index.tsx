import React from "react";
import { motion } from "framer-motion";
import { getStatusConfig } from "@/utils/statusConfig";
import { formatToIDR } from "@/utils/formatCurrency";
import Image from "next/image";

interface OrderProduct {
  id: string;
  addOn: string[];
  note?: string;
  quantity: number;
  price: number;
  menu: { img: string };
  status: string;
  menuName: string;
  subTotal: number;
}

const OrderCard = ({ product, index }: { product: OrderProduct; index: number }) => {
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
          <Image
            src={product.menu.img || "/images/placeholder.png"}
            alt={product.menuName}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMkM4IDMyIDggNDggMjQgNDhIMjhWNDRIMjRDMTYgNDQgMTYgMzYgMjQgMzZIMjhWMzJIMjRaIiBmaWxsPSIjOTI5QUEyIi8+CjxwYXRoIGQ9Ik01NiAzMkg1MlYzNkg1NkM2NCAzNiA2NCA0NCA1NiA0NEg1MlY0OEg1NkM3MiA0OCA3MiAzMiA1NiAzMloiIGZpbGw9IiM5MjlBQTIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iIzkyOUFBMiIvPgo8L3N2Zz4K";
            }}
            unoptimized={!product.menu.img.startsWith("/")}
          />
        </motion.div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="mb-3">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{product.menuName}</h3>
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
                <span className={`${statusConfig.textColor}`}>{statusConfig.text}</span>
              </motion.div>
            </div>
            <p className="text-sm text-gray-500">Qty: {product.quantity}</p>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.isArray(product.addOn) &&
              product.addOn.length > 0 &&
              product.addOn.map((addOn, index) => (
                <div
                  key={index}
                  className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1"
                >
                  {addOn}
                </div>
              ))}
          </div>

          {/* Price */}
          <div className="flex items-center w-full text-nowrap">
            <span className="font-bold text-lg text-gray-900">{formatToIDR(product.subTotal)}</span>
            <span className="text-sm text-gray-500 ml-2">({formatToIDR(product.price)} each)</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
