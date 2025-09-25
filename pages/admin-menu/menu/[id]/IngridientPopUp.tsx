"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";

interface ModalHeaderProps {
  onClose: () => void;
}

interface StockItem {
  id?: string;
  name: string;
  uom: string;
  qty: number | null;
  minQty: number | null;
}

interface IngridientItem {
  id?: string;
  menuId: string;
  stockId: string;
  value: number|null;
  uom: string;
}

interface IngridientPopUpProps {
  onClose: () => void;
  ingridientItem: IngridientItem;
  stockList: StockItem[]; // ✅ harus array
  isOpen: boolean;
}

// Animation variants
const modalVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 500, duration: 0.3 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2 } },
};

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

// Modal Header Component
const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose }) => (
  <div className="sticky top-0 bg-white rounded-t-2xl border-b px-6 py-4 flex items-center justify-between">
    <motion.div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" initial={{ width: 0 }} animate={{ width: 48 }} transition={{ delay: 0.2 }} />
    <motion.button
      onClick={onClose}
      className="absolute right-4 text-gray-500 hover:text-gray-700 p-2"
      whileHover={{ scale: 1.1, rotate: 90 }}
      whileTap={{ scale: 0.9 }}
    >
      <FaTimes />
    </motion.button>
  </div>
);

// IngridientPopUp Component// IngridientPopUp Component
const IngridientPopUp: React.FC<IngridientPopUpProps> = ({
  onClose,
  ingridientItem,
  isOpen = false,
  stockList,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const [stockForm, setStockForm] = useState<IngridientItem>({
    id: ingridientItem?.id,
    menuId: ingridientItem?.menuId,
    uom: ingridientItem?.uom ?? "",
    stockId: ingridientItem?.stockId ?? "",
    value: ingridientItem?.value ?? null,
  });

  const handleInputChange = (field: keyof IngridientItem, value: string | number): void => {
    setStockForm((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  const [errors, setErrors] = useState<Partial<Record<keyof IngridientItem, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!stockForm.stockId) newErrors.stockId = "Ingredient is required";
    if (!stockForm.value) newErrors.value = "Value UOM required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const handleSubmit = async () => {
  if (!validateForm()) return;

  const payload = {
    ...stockForm,
    value: stockForm.value ?? null,
  };

  const accessToken = getAccessToken();
  const bearerAuth = `Bearer ${accessToken}`;
  try {
    if (stockForm.id) {
      // update/edit
      console.log("Editing ingredient:", stockForm);

      await axios.put(
        `${process.env.NEXT_PUBLIC_API}/ingredients/${stockForm.id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: bearerAuth,
          },
        }
      );
    } else {
      // create/save baru
      await axios.post(`${process.env.NEXT_PUBLIC_API}/ingredients`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerAuth,
        },
      });
    }

    onClose(); // tutup modal popup
  } catch (error) {
    console.error("Error saving ingredient:", error);
  }
};


  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50"
      onClick={handleBackdropClick}
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl w-full max-h-[90vh] overflow-y-auto no-scrollbar"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <ModalHeader onClose={onClose} />

        {/* Body */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.05 }}
          className="transition-colors duration-150 bg-white p-3 rounded-lg cursor-pointer"
        >
          <div className="flex gap-2 items-center text-lg font-semibold">
            {stockForm.id ? "Edit Ingredient" : "Add New Ingredient"}
          </div>

          <div className="w-full flex gap-2 mt-3">
            {/* Select Ingredient */}
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm font-semibold">Ingredients</label>
              <select
                value={stockForm.stockId ?? ""}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  handleInputChange("stockId", selectedId);

                  const selectedStock = stockList.find((s) => s.id === selectedId);
                  if (selectedStock) {
                    handleInputChange("uom", selectedStock.uom);
                  }
                }}
                className="px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-1 bg-white"
              >
                <option value="" disabled>
                  Choose Ingredient
                </option>
                {Array.isArray(stockList) &&
                  stockList.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name}
                    </option>
                  ))}
              </select>
              {errors.stockId && <span className="text-xs text-red-500">{errors.stockId}</span>}
            </div>

            {/* Value + Uom in input */}
            <div className="flex flex-col gap-1 w-3/6">
              <label className="text-sm font-semibold">Value</label>
              <div className="relative">
                <input
                  type="number"
                  value={stockForm.value ?? ""}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  className="px-2 py-2 pr-12 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="0"
                />
                {/* UOM di dalam input */}
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                  {stockForm.uom}
                </span>
              </div>
              {errors.value && <span className="text-xs text-red-500">{errors.value}</span>}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition w-full"
            >
              {stockForm.id ? "Update" : "Save"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};


export default IngridientPopUp;
