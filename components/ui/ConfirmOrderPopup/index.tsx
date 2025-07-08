import { AnimatePresence } from "motion/react";
import { motion } from "framer-motion";
import { IoCheckmark, IoClose, IoTime, IoStop } from "react-icons/io5";

interface OrderProduct {
  id: string;
  menuName: string;
  addOn: string[] | string;
  note?: string;
  quantity: number;
  price?: number;
  img: string;
  status: "preparation" | "ready" | "completed" | "failed";
}

interface ConfirmationPopupProps {
  isOpen: boolean;
  selectedOrder: OrderProduct | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  selectedOrder,
  onConfirm,
  onCancel,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleModalClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "preparation":
        return {
          icon: IoTime,
          iconColor: "text-blue-600",
          bgColor: "bg-blue-100",
          title: "Complete Order",
          message: "Is this order ready for pickup?",
          confirmText: "Complete Order",
          confirmBg: "bg-primary-600 hover:bg-primary-700",
        };

      case "completed":
        return {
          icon: IoCheckmark,
          iconColor: "text-gray-600",
          bgColor: "bg-gray-100",
          title: "Order Already Completed",
          message: "This order has already been completed.",
          confirmText: "OK",
          confirmBg: "bg-gray-600 hover:bg-gray-700",
        };
      default:
        return {
          icon: IoCheckmark,
          iconColor: "text-warning-600",
          bgColor: "bg-warning-100",
          title: "Confirm Action",
          message: "Are you sure you want to proceed?",
          confirmText: "Confirm",
          confirmBg: "bg-primary-600 hover:bg-primary-700",
        };
    }
  };

  const statusConfig = selectedOrder
    ? getStatusConfig(selectedOrder.status)
    : getStatusConfig("preparation");
  const IconComponent = statusConfig.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={handleModalClick}
          >
            {/* Close Button */}
            <div className="flex justify-end mb-4">
              <button
                onClick={onCancel}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors duration-200"
                type="button"
                aria-label="Close popup"
              >
                <IoClose size={20} className="text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="text-center">
              <div
                className={`w-16 h-16 ${statusConfig.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <IconComponent size={32} className={statusConfig.iconColor} />
              </div>

              <h2 className="text-xl font-bold text-neutral-900 mb-2">
                {statusConfig.title}
              </h2>

              <p className="text-neutral-600 mb-6">{statusConfig.message}</p>

              {selectedOrder && (
                <div className="bg-neutral-50 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-medium text-neutral-900 mb-2">
                    {selectedOrder.menuName}
                  </h3>
                  {/* Options */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Array.isArray(selectedOrder.addOn) &&
                      selectedOrder.addOn.length > 0 &&
                      selectedOrder.addOn.map((addOn, index) => {
                        if (addOn === "") return null;

                        return (
                          <>
                            <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                              <span
                                key={index}
                                className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 h-fit"
                              >
                                {addOn}
                              </span>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                {selectedOrder?.status !== "completed" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors duration-200"
                    type="button"
                  >
                    Cancel
                  </motion.button>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className={`${
                    selectedOrder?.status === "completed" ? "w-full" : "flex-1"
                  } px-4 py-3 ${
                    statusConfig.confirmBg
                  } text-white font-medium rounded-lg transition-colors duration-200`}
                  type="button"
                >
                  {statusConfig.confirmText}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationPopup;
