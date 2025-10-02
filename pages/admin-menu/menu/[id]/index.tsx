"use client";

import React, { useState, useEffect } from "react";
import { HiArrowLeft, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { AdminLayout } from "@/components/layout";
import { useRouter } from "next/router";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";
import { toast } from "react-toastify";
import { useCategories } from "@/swr/get/categories";
import { BiEditAlt, BiMinusCircle, BiPlus, BiSave, BiSolidPlusCircle, BiTrash } from "react-icons/bi";
import Image from "next/image";
import { OUTLET_ID } from "@/services";
import IngridientPopUp from "./IngridientPopUp";
import { useStockList } from "@/swr/get/stock";
import { formatToIDR } from "@/utils/formatCurrency";
import VariantPopUp from "./VariantPopUp";

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

interface IngridientItem {
  id?: string;
  menuId: string;
  stockId: string;
  value: number | null;
  uom: string;
  stock?:{
    name:string
  }
}

type VariantItem = {
  id?: string;
  menuId: string;
  name: string;            // e.g. "Sugar", "Type", "Size", "Add On"
  value: string[];         // option labels, e.g. ["Less Sugar","Normal","Xtra Sugar"]
  addPrices: (number | null)[]; // addon prices per option, same index as value[]
};

const Stock: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // ambil id dari param URL

  const { categories } = useCategories();
  const { stockList, mutateStockList } = useStockList();
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);
  const [openPopupVariant, setOpenPopupVariant] = useState<boolean>(false);

  // Tambahkan state untuk step
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const canGoPrev = step > 1;
  const canGoNext = step < 3;

  const goPrev = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s));
  const goNext = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));

  // Validasi minimal sebelum lanjut dari Step 1 (General)
  const validateStepBeforeNext = () => {
    if (step !== 1) return true;
    const ok = validateForm();
    return ok;
  };

  const handleNext = () => {
    if (!validateStepBeforeNext()) return;
    goNext();
  };

  const [stockForm, setStockForm] = useState<MenuItem>({
    categoryId: "",
    name: "",
    desc: "",
    img: "",
    pdf: "",
    options: [],
    price: null,
    isActive: true, // ✅ NEW (default active)
  });

  const [ingridientForm, setIngridientForm] = useState<IngridientItem>({
    menuId: "",
    stockId: "",
    value: null,
    uom: "",
  });

  const [ingridientData, setIngridientData] = useState<IngridientItem[]>([]);

  const [variantData, setVariantData] = useState<VariantItem[]>([]);
  const [variantForm, setVariantForm] = useState<VariantItem>({
    name: "",
    value: [],
    addPrices: [],
    menuId:""
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof MenuItem, string>>>({});

  // ✅ fetch detail menu berdasarkan id
  const fetchMenuDetail = async () => {
    try {
      const username = process.env.NEXT_PUBLIC_BASIC_AUTH_USERNAME || "";
      const password = process.env.NEXT_PUBLIC_BASIC_AUTH_PASSWORD || "";
      const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API}/menus/main/${OUTLET_ID}/${id}`, {
        headers: {
          Authorization: basicAuth,
        },
      });

      const menu = res.data.data;

      setIngridientForm({
        ...ingridientForm, menuId : res.data.data.id
      })

      setVariantData(res.data.data.options)

      setIngridientData(res.data.data.ingredient)

      setStockForm({
        id: menu.id,
        categoryId: menu.categoryId,
        name: menu.name,
        desc: menu.desc,
        img: menu.img,
        pdf: menu.pdf,
        options: menu.options ?? [],
        price: menu.price,
        isActive: menu.isActive,
      });
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch menu detail.");
      console.error("Fetch menu detail error:", err);
      setLoading(false);
    }
  };

  // ✅ handler khusus boolean toggle
  const handleActiveToggle = () => {
    setStockForm((prev) => ({ ...prev, isActive: !prev.isActive }));
  };

  useEffect(() => {
    if (!id) return;

    fetchMenuDetail();
  }, [id]);

  // validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    if (!stockForm.name) newErrors.name = "Name is required";
    if (!stockForm.img) newErrors.img = "Image is required";
    if (!stockForm.categoryId) newErrors.categoryId = "Category is required";
    if (!stockForm.price) newErrors.price = "Price is required";
    if (!stockForm.desc) newErrors.desc = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof MenuItem, value: string | number): void => {
    setStockForm((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  // ✅ submit update
  const handleSubmit = async () => {
    if (!validateForm() || !id) return;
    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;

    const updatedOptionIds = (variantData ?? []).map(v => v?.id)

    try {
      const resp = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/menus/main/${id}`,
        {...stockForm, options : updatedOptionIds},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: bearerAuth,
          },
        }
      );

      if (resp.data.status === "success") {
        toast.success("Menu updated.");
      }
    } catch (err) {
      toast.error("Update menu error.");
      console.error("Failed to update menu", err);
    }
  };

  const onDelete = async (id:string) => {
    if (!validateForm() || !id) return;
    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;

    try {
      const resp = await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/ingredients/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: bearerAuth,
          },
        }
      );

      if (resp.data.status === "success") {
        toast.success("Menu deleted.");
        fetchMenuDetail()
      }
    } catch (err) {
      toast.error("Delete menu error.");
      console.error("Failed to update menu", err);
    }
  };

  // upload file sama kayak sebelumnya
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, img: "File must be PNG, JPG, or JPEG" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, img: "Max file size is 5MB" }));
      return;
    }

    try {
      const accessToken = getAccessToken();
      const bearerAuth = `Bearer ${accessToken}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("category", "menu");

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API}/files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: bearerAuth,
        },
      });

      const fileUrl = res.data.data.fileUrl;
      setStockForm((prev) => ({ ...prev, img: fileUrl }));
      setErrors((prev) => ({ ...prev, img: "" }));
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error("File upload error:", err);
      setErrors((prev) => ({ ...prev, img: "Upload failed" }));
      toast.error("Upload file error.");
    }
  };

  const handleDeleteVariant = async (variantId?: string) => {
    if (!variantId) return;
    const ok = window.confirm("Delete this variant? This action cannot be undone.");
    if (!ok) return;

    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;
    const updatedOptionIds = (variantData ?? [])
    .map(v => v?.id)
    .filter((id): id is string => !!id && id !== variantId);

    try {
      // (Opsional tapi disarankan) Singkronkan options menu (hapus ID yg dihapus)
      if (stockForm.id) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API}/menus/main/${stockForm.id}`,
          { ...stockForm, options: updatedOptionIds },
          { headers: { "Content-Type": "application/json", Authorization: bearerAuth } }
        );
      }

      toast.success("Variant deleted.");
      fetchMenuDetail(); // refresh UI dari server
    } catch (err) {
      console.error("Delete variant error:", err);
      toast.error("Delete variant error.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-1" style={{ height: "calc(100vh - 180px)" }}>
        <div className="flex justify-center">
          <div className="w-96 flex flex-col gap-4 p-1">
            {/* Header */}
            <div className="border-neutral-200 sticky top-0 z-10">
              <div className="flex justify-start gap-4 items-center">
                <div className="cursor-pointer" onClick={() => router.push(`/admin-menu`)}>
                  <HiArrowLeft size={20} />
                </div>
                <div className="w-full text-lg font-bold text-center pr-10">Edit Menu</div>
              </div>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between">
              {[
                { id: 1, label: "General" },
                { id: 2, label: "Variant" },
                { id: 3, label: "Ingredients" },
              ].map((s) => (
                <div key={s.id} className="flex-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => setStep(s.id as 1 | 2 | 3)}
                    className={`flex items-center gap-2 ${step === s.id ? "text-primary-600" : "text-gray-500"}`}
                  >
                    <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center border
                      ${step === s.id ? "bg-primary-600 text-white border-primary-600" : "bg-white border-gray-300"}`}>
                      {s.id}
                    </span>
                    <span className="text-xs font-medium ">{s.label}</span>
                  </button>
                  {s.id !== 3 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
                </div>
              ))}
            </div>

            {/* Form General*/}
            {step === 1 && (
              <div className="flex flex-col space-y-2 rounded-lg">
                {/* Photo */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-sm font-semibold">Photo <span className="text-red-500">*</span></div>
                  {errors.img && <span className="text-xs text-red-500">{errors.img}</span>}
                  {stockForm.img ? (
                    <div className="relative w-36">
                      <Image
                        src={stockForm.img}
                        alt="Preview"
                        className="w-36 h-36 object-cover rounded-2xl border"
                        width={144}
                        height={144}
                      />
                      <label
                        htmlFor="fileInput"
                        className="absolute top-1 right-1 bg-white rounded-full shadow-md cursor-pointer p-1"
                        title="Change photo"
                      >
                        <BiSolidPlusCircle size={18} className="text-gray-700" />
                      </label>
                      <input
                        id="fileInput"
                        type="file"
                        accept="image/png,image/jpg,image/jpeg"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="fileInput"
                      className="border-2 border-dotted cursor-pointer border-neutral-400 gap-2 rounded-2xl py-8 p-2 w-36 flex flex-col items-center justify-center"
                    >
                      <BiSolidPlusCircle size={30} />
                      <div className="text-neutral-300 text-xs">5MB|PNG,JPG,JPEG</div>
                    </label>
                  )}
                  {!stockForm.img && (
                    <input
                      id="fileInput"
                      type="file"
                      accept="image/png,image/jpg,image/jpeg"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  )}
                </div>

                {/* Name */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-sm font-semibold">Menu Name <span className="text-red-500">*</span></div>
                  <input
                    type="text"
                    value={stockForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1 w-full">
                  <div className="text-sm font-semibold">Description <span className="text-red-500">*</span></div>
                  <textarea
                    value={stockForm.desc}
                    onChange={(e) => handleInputChange("desc", e.target.value)}
                    className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                  {errors.desc && <span className="text-xs text-red-500">{errors.desc}</span>}
                </div>

                {/* Categories */}
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">Select Categories <span className="text-red-500">*</span></div>
                  <select
                    value={stockForm.categoryId ?? ""}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    className="px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-1 bg-white"
                  >
                    <option value="" disabled>
                      Choose Categories
                    </option>
                    {Array.isArray(categories) &&
                      categories.map((stock) => (
                        <option key={stock.id} value={stock.id}>
                          {stock.name}
                        </option>
                      ))}
                  </select>
                  {errors.categoryId && <span className="text-xs text-red-500">{errors.categoryId}</span>}
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">
                    Price <span className="text-red-500">*</span>
                  </div>
                  <div className="flex items-center border rounded-lg focus-within:ring-1 focus-within:ring-primary-500">
                    <span className="px-2 text-sm text-gray-600">Rp</span>
                    <input
                      type="text"
                      value={stockForm.price !== null && stockForm.price !== undefined
                        ? stockForm.price.toLocaleString("id-ID")
                        : ""}
                      onChange={(e) => {
                        // Hapus semua non-digit
                        const raw = e.target.value.replace(/\D/g, "");
                        const numericValue = raw ? parseInt(raw, 10) : null;
                        setStockForm((prev) => ({ ...prev, price: numericValue }));
                      }}
                      className="px-2 py-2 w-full text-sm border-l border-gray-300 focus:outline-none rounded-r-lg"
                      placeholder="0"
                    />
                  </div>
                  {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
                </div>

                <div className="flex items-center justify-between py-2">
                  <div className="text-sm font-semibold">Status</div>
                  <label className="inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={stockForm.isActive}
                      onChange={handleActiveToggle}
                    />
                    <div
                      className="
                        w-11 h-6 bg-gray-300 rounded-full
                        peer-checked:bg-green-500
                        relative transition-colors duration-200
                        after:content-[''] after:absolute after:top-0.5 after:left-0.5
                        after:w-5 after:h-5 after:bg-white after:rounded-full
                        after:transition-all after:duration-200
                        peer-checked:after:translate-x-5
                      "
                      aria-label="Toggle active status"
                    />
                    <span className="ml-3 text-sm font-medium">
                      {stockForm.isActive ? "Active" : "Non Active"}
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    className="p-2 text-sm rounded-lg w-full transition-colors duration-200 bg-neutral-600 text-white px-5"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Update
                  </button>
                </div>
              </div>
            )}
            
            {/* Form Variant*/}
            {step === 2 && (
              <div className="flex flex-col space-y-2 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">Input Variant</div>
                  <div 
                    className="text-sm font-medium flex gap-1 items-center text-blue-500"
                    onClick={() => {
                      setOpenPopupVariant(true)
                      setVariantForm({
                        name: "",
                        value: [],
                        addPrices: [],
                        menuId:""
                      })
                    }}
                  ><BiPlus /> Add New</div>
                </div>
                {
                  Array.isArray(variantData) && variantData.length === 0 && 
                  <div className="flex justify-center text-sm">Variant not found.</div>
                }
              
                {variantData.map((g) => (
                  <div key={g.id} className="pb-2 border p-2 rounded-lg bg-white shadow-sm">
                    <div className="flex justify-between gap-1">
                      <div className="text-sm font-semibold mb-2">{g.name}</div>
                      <div className="text-sm font-semibold mb-2 flex gap-1">
                        <BiEditAlt 
                          size={20} color="blue" 
                          onClick={() => {
                            setVariantForm(g)
                            setOpenPopupVariant(true)
                          }}
                        />
                        <BiTrash 
                          size={20} color="red"
                          onClick={() => {
                            handleDeleteVariant(g.id)
                          }} 
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      {g.value.map((label, i) => {
                        const priceNum = Number(g.addPrices?.[i] ?? 0);
                        return (
                          <div key={`${g.id}-${i}`} className="flex items-center gap-1">
                            <span className="flex-1 text-sm">{label}</span>
                            <div className="border bg-white px-3 py-1 rounded-lg text-sm w-32 text-left">
                              {formatToIDR(priceNum)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Form Ingridients*/}
            {step === 3 && (
              <div className="w-full flex flex-col">
                <div className="flex justify-between items-center">
                  <div className="text-sm font-bold">Input Ingridients</div>
                  <div 
                    className="text-sm font-medium flex gap-1 items-center text-blue-500"
                    onClick={() => {
                      setOpenPopupOrder(true)
                      mutateStockList()
                    }}
                  ><BiPlus /> Add New</div>
                </div>
                <div className="grid max-h-96 overflow-auto py-2 gap-2">
                  {
                    Array.isArray(ingridientData) && ingridientData.length === 0 && 
                    <div className="flex justify-center text-sm">Ingridient not found.</div>
                  }
                  {Array.isArray(ingridientData) &&
                    ingridientData.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between gap-1 items-center"
                      >
                        <div className="flex gap-1 items-center">
                          <div 
                            className="font-semibold"
                            onClick={() => {
                              onDelete(item.id??"")
                            }}
                          >
                            <BiMinusCircle color="red" size={18}/>
                          </div>
                          <div 
                            className="font-semibold text-sm underline"
                            onClick={() => {
                              setOpenPopupOrder(true)
                              mutateStockList()
                              setIngridientForm(item)
                            }}
                          >
                            {item.stock?.name}
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="bg-white p-1 min-w-20 rounded-xl shadow-sm text-sm text-center">
                            {item.value}
                          </div>
                          <div className="min-w-6 rounded-xl text-sm">
                            {item.uom}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div> 
            )}

            {/* ===== NAVIGATION (Prev / indicator / Next) ===== */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={goPrev}
                disabled={!canGoPrev}
                className={`flex text-xs items-center gap-1 px-3 py-2 rounded-lg border-2 ${
                  !canGoPrev ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                }`}
              >
                <HiChevronLeft /> 
              </button>
              <span className="text-xs">{step}/3</span>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className={`flex text-xs items-center gap-1 px-3 py-2 rounded-lg border-2 ${
                    !canGoNext ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
                  }`}
                >
                <HiChevronRight />
                </button>
              ) : (
                /* Di step terakhir tampilkan tombol Update utama */
                <button
                  className="p-2 rounded-lg  transition-colors duration-200 bg-neutral-600 text-white px-5"
                  type="button"
                  onClick={handleSubmit}
                >
                  <BiSave />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {openPopupOrder && (
        <IngridientPopUp
          ingridientItem={ingridientForm}
          onClose={() => {
            setOpenPopupOrder(false);
            fetchMenuDetail()
          }}
          stockList={stockList}
          isOpen={openPopupOrder}
        />
      )}

      {openPopupVariant && (
        <VariantPopUp
          variantItem={variantForm}
          variantData={variantData}
          stockForm={stockForm}
          onClose={() => {
            setOpenPopupVariant(false);
            fetchMenuDetail();
          }}
          isOpen={openPopupVariant}
        />
      )}
      
    </AdminLayout>
  );
};

export default Stock;
