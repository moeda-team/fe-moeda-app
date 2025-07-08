import { getStatusConfig } from "@/utils/statusConfig";
import { motion } from "framer-motion";
import Image from "next/image";
import { IoCheckmark, IoTime, IoStop, IoRefresh } from "react-icons/io5";

interface OrderProduct {
  id: string;
  menuName: string;
  type: "Hot" | "Ice";
  size: "Regular" | "Large";
  iceCube: "Less" | "Normal" | "More Ice" | "No Ice Cube";
  sweet: "Normal" | "Less Sugar";
  addOns: "Extra Cheese" | "Fried Egg" | "Crackers";
  spicyLevel: "Mild" | "Medium" | "Hot";
  note?: string;
  quantity: number;
  price?: number;
  img: string;
  status: "preparation" | "ready" | "completed" | "failed";
  addOn: string[];
}

interface OrderCardProps {
  order: OrderProduct;
  index: number;
  onActionOrder: (order: OrderProduct) => Promise<void>;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  index,
  onActionOrder,
}) => {
  const statusConfig = getStatusConfig(order.status);

  const getButtonConfig = (status: string) => {
    switch (status) {
      case "preparation":
        return {
          text: "Complete Order",
          icon: IoTime,
          bgColor: "bg-primary-600 hover:bg-primary-700",
          disabled: false,
        };
      case "completed":
        return {
          text: "Completed",
          icon: IoCheckmark,
          bgColor: "bg-gray-400",
          disabled: true,
        };
      default:
        return {
          text: "Update Status",
          icon: IoCheckmark,
          bgColor: "bg-primary-600 hover:bg-primary-700",
          disabled: false,
        };
    }
  };

  const buttonConfig = getButtonConfig(order.status);
  const ButtonIcon = buttonConfig.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 hover:shadow-md transition-shadow duration-200 flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="h-[140px] w-full">
        <Image
          className="p-2 rounded-[32px]"
          src={order.img}
          alt="Food"
          width={300}
          height={140}
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          priority
        />
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1">
        <motion.div
          className={`${statusConfig.bgColor} px-3 py-1 rounded-full text-xs flex items-center gap-1 w-fit mb-2`}
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
        <h3 className="font-semibold text-neutral-900 mb-3 leading-tight">
          {order.menuName}
        </h3>

        {/* Options */}
        <div className="flex flex-wrap gap-2 mb-6 flex-1">
          {Array.isArray(order.addOn) &&
            order.addOn.length > 0 &&
            order.addOn.map((addOn, index) => {
              if (!addOn) return null;

              return (
                <span
                  key={index}
                  className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 h-fit"
                >
                  {addOn}
                </span>
              );
            })}
        </div>

        {/* Action Button - Pinned to bottom */}
        <motion.button
          whileHover={!buttonConfig.disabled ? { scale: 1.02 } : {}}
          whileTap={!buttonConfig.disabled ? { scale: 0.98 } : {}}
          onClick={() => !buttonConfig.disabled && onActionOrder(order)}
          disabled={buttonConfig.disabled}
          className={`w-full ${
            buttonConfig.bgColor
          } text-white font-medium py-3 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-auto ${
            buttonConfig.disabled ? "cursor-not-allowed opacity-70" : ""
          }`}
          type="button"
        >
          <ButtonIcon size={18} />
          {buttonConfig.text}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default OrderCard;
