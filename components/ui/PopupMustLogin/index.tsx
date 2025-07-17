import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const PopupMustLogin = ({ isOpen = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Popup Container */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Content */}
              <div className="p-6">
                <div className="text-center space-y-4">
                  {/* Message */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-primary-800">To Order Menu</h3>
                    <p className="text-primary-600 leading-relaxed">
                      Please scan the QR code located on your table to access the menu and place your order.
                    </p>
                  </div>

                  {/* Instructions */}
                  <div className="bg-primary-50 p-4 rounded-xl space-y-2">
                    <h4 className="font-medium text-primary-800 text-sm">How to scan:</h4>
                    <div className="text-sm text-primary-700 space-y-1">
                      <p>1. Open your phones camera app</p>
                      <p>2. Point it at the QR code on your table</p>
                      <p>3. Tap the notification to open the menu</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PopupMustLogin;
