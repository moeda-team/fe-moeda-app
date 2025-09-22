"use client";

import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { AdminLayout } from "@/components/layout";
import { useRouter } from "next/router";
import { IoPricetag } from "react-icons/io5";
import VoucherUsed from "./VoucherUsed";
import { BiCopy, BiEdit } from "react-icons/bi";
import { useVoucher, useVoucherToday } from "@/swr/get/voucher";
import { formatToIDR } from "@/utils/formatCurrency";
import { SearchBar } from "@/components/sections";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";

interface VoucherItem {
  id?: string;
  name: string;
  type: string;
  discount: number | null;
  maxAmount: number | null;
  expiredAt: string;
}

const Voucher: React.FC = () => {
  const router = useRouter();

  const { search } = router.query;
  const { vouchers, mutate } = useVoucher({
    search: search as string,
  });

  const { vouchersUsed } = useVoucherToday();

  const handleSearch = (search: string) => {
    router.push({
      pathname: router.pathname,
      query: {
        search: search,
      },
    });
  };

  // form
  const [voucherForm, setVoucherForm] = useState<VoucherItem>({
    name: "",
    type: "",
    discount: null,
    maxAmount: null,
    expiredAt: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof VoucherItem, string>>>({});
  const [editingVoucher, setEditingVoucher] = useState<VoucherItem | null>(null);

  const handleInputChange = (field: keyof VoucherItem, value: string | number): void => {
    setVoucherForm((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  // validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!voucherForm.name) newErrors.name = "Name is required";
    if (!voucherForm.type) newErrors.type = "Type is required";
    if (!voucherForm.expiredAt) newErrors.expiredAt = "Expired date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit create/edit
  const handleSubmit = async () => {
    if (!validateForm()) return;
    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;

    const payload = {
      ...voucherForm,
      discount: voucherForm.discount ?? null,
      maxAmount: voucherForm.maxAmount ?? null,
    };

    try {
      if (editingVoucher) {
        await axios.put(
          `${process.env.NEXT_PUBLIC_API}/vouchers/${editingVoucher.id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: bearerAuth,
            },
          }
        );
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API}/vouchers`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: bearerAuth,
          },
        });
      }

      // reset form & refresh data
      setVoucherForm({
        name: "",
        type: "",
        discount: null,
        maxAmount: null,
        expiredAt: "",
      });
      setEditingVoucher(null);
      setErrors({});
      mutate();
    } catch (err) {
      console.error("Failed to submit voucher", err);
    }
  };

  // set edit form
  const handleEdit = (voucher: VoucherItem) => {
    setEditingVoucher(voucher);
    setVoucherForm({
      ...voucher,
      expiredAt: voucher.expiredAt ? voucher.expiredAt.split("T")[0] : "",
    });
  };


  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-1" style={{ height: "calc(100vh - 180px)" }}>
        <div className="flex justify-center">
          <div className="max-w-xl flex flex-col gap-4 p-1">
            {/* Header */}
            <div className="border-neutral-200 sticky top-0 z-10">
              <div className="flex justify-start gap-4 items-center">
                <div className="cursor-pointer" onClick={() => router.push(`/admin-menu`)}>
                  <HiArrowLeft size={20} />
                </div>
                <div className="w-full text-lg font-bold text-center pr-10">Voucher</div>
              </div>
            </div>

            {/* card used */}
            <div className="bg-white p-2 flex flex-col rounded-lg">
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <div className="bg-blue-200 p-2 rounded-full">
                    <IoPricetag size={25} className="text-white bg-blue-500 p-1 rounded-full" />
                  </div>
                  <div className="text-neutral-900 font-bold lg:text-xl text-lg">Voucher</div>
                </div>
                <div className="text-neutral-300 lg:text-xl text-sm font-semibold">Today</div>
              </div>
              <VoucherUsed total={vouchersUsed.total ?? 0} used={vouchersUsed.used??0} />
            </div>

            {/* form create / edit */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">{editingVoucher ? "Edit Voucher" : "Create Voucher"}</div>
              <div className="bg-white p-3 rounded-lg flex flex-col gap-2">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <div className="text-xs font-semibold">Voucher name</div>
                  <input
                    type="text"
                    value={voucherForm.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="px-2 py-1 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    placeholder="Name"
                  />
                  {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                </div>

                {/* Type & Max Amount */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-semibold">Type</div>
                    <select
                      value={voucherForm.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="px-2 py-1 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="">Select Type</option>
                      <option value="percent">Percent</option>
                      <option value="fixed">Fixed</option>
                    </select>
                    {errors.type && <span className="text-xs text-red-500">{errors.type}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-semibold">Max Amount</div>
                    <input
                      type="number"
                      value={voucherForm.maxAmount ?? ""}
                      onChange={(e) => handleInputChange("maxAmount", e.target.value === "" ? "" : Number(e.target.value))}
                      className="px-2 py-1 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="ex : 10"
                    />
                  </div>
                </div>

                {/* Discount & Expired Date */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-semibold">Voucher Disc</div>
                    <input
                      type="number"
                      value={voucherForm.discount ?? ""}
                      onChange={(e) => handleInputChange("discount", e.target.value === "" ? "" : Number(e.target.value))}
                      className="px-2 py-1 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                      placeholder="ex : 10% or 10.000"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-xs font-semibold">Expired Date</div>
                    <input
                      type="date"
                      value={voucherForm.expiredAt}
                      onChange={(e) => handleInputChange("expiredAt", e.target.value)}
                      className="px-2 py-1 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                    {errors.expiredAt && <span className="text-xs text-red-500">{errors.expiredAt}</span>}
                  </div>
                </div>

                {/* Button */}
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    className="p-1 text-sm rounded-full transition-colors duration-200 bg-neutral-600 text-white px-5"
                    type="button"
                    onClick={handleSubmit}
                  >
                    {editingVoucher ? "Update" : "Submit"}
                  </button>
                  {editingVoucher && (
                    <button
                      className="p-1 text-sm rounded-full transition-colors duration-200 text-neutral-500 border-2 px-5"
                      type="button"
                      onClick={() => {
                        setEditingVoucher(null);
                        setVoucherForm({
                          name: "",
                          type: "",
                          discount: null,
                          maxAmount: null,
                          expiredAt: "",
                        });
                        setErrors({});
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Recently added */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">Recently added</div>
              <SearchBar onSearch={handleSearch} />
              <div className="grid grid-cols-1 text-white gap-2">
                {Array.isArray(vouchers) &&
                  vouchers.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-2 gap-1 bg-neutral-200 rounded-lg relative"
                      style={{
                        backgroundImage: "url('/images/bg-voucher.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <span className="text-sm font-semibold">Discount</span>
                      <span className="text-2xl font-bold">
                        {item.type === "percent"
                          ? `${item.discount ?? 0}%`
                          : item.discount
                          ? `${formatToIDR(item.discount)}`
                          : "-"}
                      </span>
                      <div
                        className="bg-white p-1 text-black flex items-center rounded-sm max-w-44 gap-1 cursor-pointer"
                        onClick={() => navigator.clipboard.writeText(item.name)}
                      >
                        <BiCopy />
                        <span className="text-xs">
                          Kode : <b>{item.name}</b>
                        </span>
                      </div>

                      {/* Edit button */}
                      <button
                        className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-lg"
                        onClick={() => handleEdit(item)}
                      >
                        <BiEdit size={15} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Voucher;
