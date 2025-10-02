"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";
import { BiMinusCircle } from "react-icons/bi";
import { useProductOptions } from "@/swr/get/productOptions";

// ================== Types ==================
interface ModalHeaderProps {
  onClose: () => void;
}

type VariantItem = {
  id?: string;
  menuId: string;
  name: string;            // e.g. "Sugar", "Type", "Size", "Add On"
  value: string[];         // option labels, e.g. ["Less Sugar","Normal","Xtra Sugar"]
  addPrices: (number | null)[]; // addon prices per option, same index as value[]
};

interface MenuItem {
  id?: string;
  categoryId: string;
  name: string;
  desc: string;
  img: string;
  pdf: string;
  options: string[];
  price: number | null;
  isActive: boolean; // ✅ NEW
}

interface VariantPopUpProps {
  onClose: () => void;
  variantItem: VariantItem; // data saat edit / default saat add
  variantData: VariantItem[];
  stockForm: MenuItem;
  isOpen: boolean;
}

// ================== Animations ==================
const modalVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 25, stiffness: 500, duration: 0.3 } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.2 } },
};

const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };

// ================== Helpers ==================
const formatIDR = (n: number | null | undefined) =>
  n === null || n === undefined ? "" : `Rp. ${n.toLocaleString("id-ID")}`;

const parseIDR = (s: string) => {
  const raw = s.replace(/\D/g, "");
  return raw ? Number(raw) : null;
};

// ================== UI Fragments ==================
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

// ================== Component ==================
const VariantPopUp: React.FC<VariantPopUpProps> = ({ onClose, variantItem, isOpen = false, stockForm, variantData }) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose();
  };

  const { productOptions } = useProductOptions();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ========= Form State =========
  const [form, setForm] = useState<VariantItem>(() => ({
    id: variantItem?.id,
    menuId: variantItem?.menuId ?? "",
    name: variantItem?.name ?? "",
    value: Array.isArray(variantItem?.value) && variantItem.value.length ? [...variantItem.value] : [""],
    addPrices: Array.isArray(variantItem?.addPrices) && variantItem.addPrices.length
      ? variantItem.addPrices.map((p) => (p === null || p === undefined ? 0 : Number(p)))
      : [0],
  }));

  // ========= Errors & Validation =========
  const [errors, setErrors] = useState<Partial<Record<keyof VariantItem | "value[0]", string>>>({});

  const validateForm = (): boolean => {
    const newErr: typeof errors = {};
    if (!form.name?.trim()) newErr.name = "Variant name is required";
    if (!form.value?.length) newErr["value[0]"] = "At least one option is required";

    // minimal: harus ada 1 label option yg tidak kosong
    const hasAnyLabel = form.value.some((v) => (v || "").trim().length > 0);
    if (!hasAnyLabel) newErr["value[0]"] = "Please add at least one option label";

    // sync length
    if (form.value.length !== form.addPrices.length) {
      newErr["value[0]"] = "Internal mismatch: options & prices length differ";
    }

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // ========= Handlers =========
  const setName = (name: string) => setForm((p) => ({ ...p, name }));

  const addOption = () =>
    setForm((p) => ({ ...p, value: [...p.value, ""], addPrices: [...p.addPrices, 0] }));

  const removeOption = (idx: number) =>
    setForm((p) => ({
      ...p,
      value: p.value.filter((_, i) => i !== idx),
      addPrices: p.addPrices.filter((_, i) => i !== idx),
    }));

  const changeOptionLabel = (idx: number, label: string) =>
    setForm((p) => {
      const next = [...p.value];
      next[idx] = label;
      return { ...p, value: next };
    });

  const changeOptionPrice = (idx: number, input: string) =>
    setForm((p) => {
      const n = parseIDR(input);
      const prices = [...p.addPrices];
      prices[idx] = n ?? 0;
      return { ...p, addPrices: prices };
    });

  // ========= Submit =========
  const handleSubmit = async () => {
    if (!validateForm()) return;

    // normalisasi payload: harga 0 jika kosong, dan kirim sebagai number[] (atau string[] jika backend mau string)
    const payload = {
      id: form.id,
      menuId: form.menuId,
      name: form.name.trim(),
      value: form.value.map((v) => (v || "").trim()),
      addPrices: form.addPrices.map((n) => (n ?? 0)), // <- jika backend perlu string: String(n ?? 0)
    };

    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;

    try {
      if (form.id) {
        await axios.put(`${process.env.NEXT_PUBLIC_API}/menus/options/${form.id}`, payload, {
          headers: { "Content-Type": "application/json", Authorization: bearerAuth },
        });
      } else {
        const resp = await axios.post(`${process.env.NEXT_PUBLIC_API}/menus/options`, payload, {
          headers: { "Content-Type": "application/json", Authorization: bearerAuth },
        });
        
        const newId = resp.data.data.id
        if(newId){
          const idsFromVariantData: string[] = Array.isArray(variantData)
            ? variantData.map(v => v.id).filter((x): x is string => Boolean(x))
            : [];

          const mergedOptionIds = Array.from(
            new Set([...idsFromVariantData, newId])
          );

          await axios.put(
            `${process.env.NEXT_PUBLIC_API}/menus/main/${stockForm.id}`,
            {
              ...stockForm,
              options : mergedOptionIds
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: bearerAuth,
              },
            }
          );
        }
      }
      onClose();
    } catch (error) {
      console.error("Error saving Variant:", error);
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
          className="transition-colors duration-150 bg-white p-4 rounded-lg"
        >
          <div className="flex gap-2 items-center text-lg font-semibold">
            {form.id ? "Edit Variant" : "Add New Variant"}
          </div>

          {/* Group Name */}
          {!form.id ?
            <div className="mt-3">
            <label className="text-sm font-semibold">Select from the existing ones</label>
              <select
                onChange={(e) => {
                  const selectedId = e.target.value
                  if(selectedId){
                    const updatedOptionIds = (productOptions).filter((opt:VariantItem) => opt.id === selectedId);
                    setForm((p) => ({
                      ...p,
                      id:"",
                      name : updatedOptionIds[0].name,
                      value : updatedOptionIds[0].value,
                      addPrices : updatedOptionIds[0].addPrices,
                    }));
                  }

                }}
                className="px-2 py-2 border text-sm rounded-lg w-full focus:outline-none focus:ring-1 bg-white"
              >
                <option value="">
                  Choose a variant
                </option>
                {Array.isArray(productOptions) &&
                  productOptions.map((stock) => (
                    <option key={stock.id} value={stock.id}>
                      {stock.name}
                    </option>
                  ))}
              </select>
            </div>
          :""}

          <div className={`mt-3`}>
            <label className="text-sm font-semibold">Variant name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Add On / Sugar / Type / Size"
              className="mt-1 px-3 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
          </div>

          {/* Options List */}
          <div className="mt-4 border p-2 rounded-lg bg-white shadow-sm max-h-72 overflow-auto">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold mb-2">{form.name || "Options"}</div>
                
              <button
                type="button"
                onClick={addOption}
                className="text-blue-600 text-sm  flex items-center gap-1"
              >
                <span className="text-lg leading-none">＋</span> Add option
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {form.value.map((label, i) => (
                <div key={`opt-${i}`} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => removeOption(i)}
                    className="p-1"
                    title="Remove option"
                  >
                    <BiMinusCircle color="red" size={18}/>
                  </button>

                  {/* label option */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center border rounded-lg bg-white ">
                      <input
                        type="text"
                        value={label}
                        onChange={(e) => changeOptionLabel(i, e.target.value)}
                        placeholder="Label (e.g. Less Sugar)"
                        className="flex-1 border px-3 py-2 rounded-lg text-sm w-full"
                      />
                    </div>

                    {/* harga addon */}
                    <div className="flex items-center border rounded-lg bg-white">
                      <span className="px-2 text-xs text-gray-600">Rp.</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={formatIDR(form.addPrices[i] ?? 0).replace(/^Rp\. /, "")}
                        onChange={(e) => changeOptionPrice(i, e.target.value)}
                        className="px-2 py-2 w-full text-right text-sm border-l rounded-r-lg focus:outline-none"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {errors["value[0]"] && <div className="text-xs text-red-500 mt-2">{errors["value[0]"]}</div>}
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition w-full"
            >
              {form.id ? "Update" : "Save"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VariantPopUp;
