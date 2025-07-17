interface QuantitySelectorProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

import { motion } from "framer-motion";
import { FaMinus, FaPlus } from "react-icons/fa";

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onIncrement, onDecrement }) => (
  <div className="flex items-center gap-3">
    <motion.button
      type="button"
      onClick={onDecrement}
      className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-teal-800"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaMinus size={12} />
    </motion.button>
    <motion.span
      className="w-8 text-center font-medium"
      key={quantity}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring" }}
    >
      {quantity}
    </motion.span>
    <motion.button
      type="button"
      onClick={onIncrement}
      className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-teal-800"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaPlus size={12} />
    </motion.button>
  </div>
);

export default QuantitySelector;
