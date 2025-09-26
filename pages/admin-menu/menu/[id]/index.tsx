"use client";

import React, { useState, useEffect } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { AdminLayout } from "@/components/layout";
import { useRouter } from "next/router";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";
import { toast } from "react-toastify";
import { useCategories } from "@/swr/get/categories";
import { BiMinusCircle, BiPlus, BiSolidPlusCircle } from "react-icons/bi";
import Image from "next/image";
import { OUTLET_ID } from "@/services";
import IngridientPopUp from "./IngridientPopUp";
import { useIngridients, useStockList } from "@/swr/get/stock";

interface MenuItem {
  id?: string;
  categoryId: string;
  name: string;
  desc: string;
  img: string;
  pdf: string;
  options: string[];
  price: number | null;
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

const Stock: React.FC = () => {
  const router = useRouter();
  const { id } = router.query; // ambil id dari param URL

  const { categories } = useCategories();
  const { stockList, mutateStockList } = useStockList();
  const [openPopupOrder, setOpenPopupOrder] = useState<boolean>(false);

  const [stockForm, setStockForm] = useState<MenuItem>({
    categoryId: "",
    name: "",
    desc: "",
    img: "",
    pdf: "",
    options: [],
    price: null,
  });

  const [ingridientForm, setIngridientForm] = useState<IngridientItem>({
    menuId: "",
    stockId: "",
    value: null,
    uom: "",
  });

  const [ingridientData, setIngridientData] = useState<IngridientItem[]>([]);

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

      setIngridientData(
        res.data.data.ingredient
      )

      setStockForm({
        id: menu.id,
        categoryId: menu.categoryId,
        name: menu.name,
        desc: menu.desc,
        img: menu.img,
        pdf: menu.pdf,
        options: menu.options ?? [],
        price: menu.price,
      });
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch menu detail.");
      console.error("Fetch menu detail error:", err);
      setLoading(false);
    }
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

    try {
      const resp = await axios.put(
        `${process.env.NEXT_PUBLIC_API}/menus/main/${id}`,
        stockForm,
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

            {/* Form */}
            <div className="flex flex-col space-y-2 rounded-lg">
              {/* Photo */}
              <div className="flex flex-col gap-1 w-full">
                <div className="text-sm font-semibold">Photo</div>
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
                <div className="text-sm font-semibold">Menu Name</div>
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
                <div className="text-sm font-semibold">Description</div>
                <textarea
                  value={stockForm.desc}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                  className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                {errors.desc && <span className="text-xs text-red-500">{errors.desc}</span>}
              </div>

              {/* Categories */}
              <div className="flex flex-col gap-1">
                <div className="text-sm font-semibold">Select Categories</div>
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
                <div className="text-sm font-semibold">Price</div>
                <input
                  type="number"
                  value={stockForm.price ?? ""}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  placeholder="0"
                />
                {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
              </div>

              {/* Ingredient */}
              <div className="w-full flex flex-col">
                <div className="flex justify-between mt-4 items-center">
                  <div className="text-sm font-bold">Ingredient</div>
                  <div 
                    className="text-xs font-medium flex gap-1 items-center text-blue-500"
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
                          <div className="bg-white p-1 min-w-20 rounded-xl text-sm text-center">
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
    </AdminLayout>
  );
};

export default Stock;
