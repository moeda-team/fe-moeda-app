"use client";

import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { AdminLayout } from "@/components/layout";
import { useRouter } from "next/router";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";
import { toast } from "react-toastify";
import { useCategories } from "@/swr/get/categories";
import { BiSolidPlusCircle } from "react-icons/bi";
import Image from "next/image";

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


const Stock: React.FC = () => {
  const router = useRouter();

  const { categories } = useCategories();
  

  // form
  const [stockForm, setStockForm] = useState<MenuItem>({
    categoryId: "",
    name: "",
    desc: "",
    img: "https://moeda-space.s3.ap-southeast-1.amazonaws.com/choco+banana.png",
    pdf: "https://moeda-space.s3.ap-southeast-1.amazonaws.com/iced-matcha.pdf",
    options: [],
    price: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof MenuItem, string>>>({});

  // validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!stockForm.name) newErrors.name = "Name is required";
    if (!stockForm.img) newErrors.img = "Image must be PNG, JPG, JPEG";
    if (!stockForm.categoryId) newErrors.categoryId = "Category is required";
    if (!stockForm.price) newErrors.price = "Price is required";
    if (!stockForm.desc) newErrors.desc = "Decription is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof MenuItem, value: string | number): void => {
    setStockForm((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  // submit create/edit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;

    const payload = {
      ...stockForm,
      price: stockForm.price ?? null,
    };

    try {
      const resp = await axios.post(`${process.env.NEXT_PUBLIC_API}/menus/main`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerAuth,
        },
      });

      if(resp.data.status === 'success'){
        toast.success("Menu created.");
        setTimeout(() => {
          window.location.assign(`/admin-menu/menu/${resp.data.data.id}`)
        }, 2000);
      }
      setErrors({});
    } catch (err) {
      toast.error("Created menu error.");
      console.error("Failed to submit voucher", err);
    }
  };

  // state untuk simpan file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // handle file select
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // validasi type dan size
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
      formData.append("category", 'menu');

      // upload ke API /files
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/files`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: bearerAuth,
          },
        }
      );

      const fileUrl = res.data.url;

      setSelectedFile(file);
      setStockForm((prev) => ({
        ...prev,
        img: fileUrl, // simpan URL dari API
      }));
      setErrors((prev) => ({ ...prev, img: "" }));
      toast.success("File uploaded successfully");
    } catch (err) {
      console.error("File upload error:", err);
      setErrors((prev) => ({ ...prev, img: "Upload failed" }));
      toast.error("Upload file error.");
    }
  };


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
                <div className="w-full text-lg font-bold text-center pr-10">Add New Menu</div>
              </div>
            </div>
            
            {/* Form */}
            <div className="flex flex-col">

              <div className="space-y-2 rounded-lg">
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="text-sm font-semibold">Photo</div>
                    {errors.img && <span className="text-xs text-red-500">{errors.img}</span>}

                    {stockForm.img ? (
                      // preview image kalau sudah ada img
                      <div className="relative w-36">
                        <Image
                          src={stockForm.img}
                          alt="Preview"
                          className="w-36 h-36 object-cover rounded-2xl border"
                          width={36}
                          height={36}
                        />
                        {/* tombol ganti file */}
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
                      // kotak upload default
                      <label
                        htmlFor="fileInput"
                        className="border-2 border-dotted cursor-pointer border-neutral-400 gap-2 rounded-2xl py-8 p-2 w-36 flex flex-col items-center justify-center"
                      >
                        <BiSolidPlusCircle size={30} />
                        <div className="text-neutral-300 text-xs">5MB|PNG,JPG,JPEG</div>
                      </label>
                    )}

                    {/* hidden input utk trigger upload */}
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

                </div>
                <div className="flex gap-2">
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
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="text-sm font-semibold">Description</div>
                    <textarea
                      value={stockForm.desc}
                      onChange={(e) => handleInputChange("desc", e.target.value)}
                      className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {errors.desc && <span className="text-xs text-red-500">{errors.desc}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">Select Categories</div>
                  <select
                    value={stockForm.categoryId ?? ""}
                    onChange={(e) => {
                      const selectedId = e.target.value
                      handleInputChange("categoryId", selectedId)
                    }}
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
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-semibold">Price</div>
                  <input
                    type="number"
                    value={stockForm.price ??""}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="0"
                  />
                  {errors.price && <span className="text-xs text-red-500">{errors.price}</span>}
                </div>
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    className="p-2 text-sm rounded-lg w-full transition-colors duration-200 bg-neutral-600 text-white px-5"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Stock;
