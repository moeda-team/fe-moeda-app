"use client";

import React, { useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { AdminLayout } from "@/components/layout";
import { useRouter } from "next/router";
import { BiCopy, BiEdit } from "react-icons/bi";
import { useVoucher, useVoucherToday } from "@/swr/get/voucher";
import { formatToIDR } from "@/utils/formatCurrency";
import { SearchBar } from "@/components/sections";
import axios from "axios";
import { getAccessToken } from "@/helpers/getAccessToken";
import { useNeedToBuy, useStockList, useStockRecent } from "@/swr/get/stock";
import moment from "moment";
import { FiAlertOctagon } from "react-icons/fi";
import { toast } from "react-toastify";
import { OUTLET_ID } from "@/services";

interface StockItem {
  id?: string;
  name: string;
  uom: string;
  qty: number | null;
  minQty: number | null;
}

interface StockLogItem {
  outletId?: string;
  stockId: string;
  uom: string;
  type: string;
  note: string;
  qty: number | null;
}

const Stock: React.FC = () => {
  const router = useRouter();

  const { search } = router.query;
  const { recentStocks, mutate } = useStockRecent({
    search: search as string,
  });

  const { needToBuy, mutateDataNeed } = useNeedToBuy();
  const { stockList, mutateStockList} = useStockList();

  const handleSearch = (search: string) => {
    router.push({
      pathname: router.pathname,
      query: {
        search: search,
      },
    });
  };

  // form
  const [activeTab, setActiveTab] = useState("ingredient");
  const [stockForm, setStockForm] = useState<StockItem>({
    name: "",
    uom: "",
    qty: null,
    minQty: null,
  });
  const [stockLogForm, setStockLogForm] = useState<StockLogItem>({
    outletId: OUTLET_ID,
    type: "inbound",
    stockId: "",
    uom: "",
    note: "",
    qty: null,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof StockItem, string>>>({});
  const [logErrors, setLogErrors] = useState<Partial<Record<keyof StockLogItem, string>>>({});

  // validate form
  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!stockForm.name) newErrors.name = "Name is required";
    if (!stockForm.uom) newErrors.uom = "Uom is required";
    if (!stockForm.minQty) newErrors.minQty = "Min. qty is required";
    if (!stockForm.qty) newErrors.qty = "Last qty is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogForm = (): boolean => {
    const newErrors: typeof logErrors = {};

    if (!stockLogForm.stockId) newErrors.stockId = "Ingredient is required";
    if (!stockLogForm.note) newErrors.note = "Note is required";
    if (!stockLogForm.qty) newErrors.qty = "Qty is required";

    setLogErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof StockItem, value: string | number): void => {
    setStockForm((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  const handleInputChangeLog = (field: keyof StockLogItem, value: string | number): void => {
    setStockLogForm((prev) => ({
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
      qty: stockForm.qty ?? null,
      minQty: stockForm.minQty ?? null,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API}/stocks/main`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerAuth,
        },
      });

      // reset form & refresh data
      setStockForm({
        name: "",
        uom: "",
        qty: null,
        minQty: null,
      });
      toast.success("Ingredient created.");
      setErrors({});
      mutate();
      mutateDataNeed();
    } catch (err) {
      console.error("Failed to submit voucher", err);
    }
  };

  const handleSubmitLog = async () => {
    if (!validateLogForm()) return;
    const accessToken = getAccessToken();
    const bearerAuth = `Bearer ${accessToken}`;

    const payload = {
      ...stockLogForm,
      qty: stockLogForm.qty ?? null,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API}/stocks/log`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: bearerAuth,
        },
      });

      // reset form & refresh data
      setStockLogForm({
        stockId: "",
        uom: "",
        qty: null,
        note:"",
        outletId:OUTLET_ID,
        type:"inbound"
      });
      toast.success("Ingredient created.");
      setErrors({});
      mutate();
      mutateDataNeed();
    } catch (err) {
      console.error("Failed to submit voucher", err);
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
                <div className="w-full text-lg font-bold text-center pr-10">Inventory Stock</div>
              </div>
            </div>

            {/* Materials Need to Buy */}
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold">Materials Need to Buy</div>
              <SearchBar onSearch={handleSearch} />
              <div className="grid gap-1 max-h-96 overflow-auto p-2 bg-white rounded-xl">
                {Array.isArray(needToBuy) &&
                  needToBuy.map((item, index) => (
                    <div
                      key={index}
                      className="flex p-2 py-3 gap-2 bg-white relative justify-between items-center border-b"
                    >
                      <div className="flex gap-2">
                        <div className="bg-red-200 p-2 rounded-full">
                          <FiAlertOctagon size={24} color="red"/>
                        </div>
                        <div className="">
                          <p className="font-bold text-sm">{item.name}</p>
                          <p className="font-medium text-xs text-neutral-300">{item.qty} {item.uom} Left</p>
                        </div>
                      </div>
                      <div className="rounded-lg bg-black text-white text-xs p-2 px-4 font-semibold">
                        Restock
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Update Stock */}
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold">Form Stok</div>
              <div className="bg-white rounded-lg">
                <div className="flex flex-col gap-2">
                  {/* Tab Header */}
                  <div className="flex border-b">
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "ingredient"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                      onClick={() => setActiveTab("ingredient")}
                    >
                      Ingredient
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "stock"
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-500 hover:text-blue-600"
                      }`}
                      onClick={() => setActiveTab("stock")}
                    >
                      Stock
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeTab === "ingredient" && (
                    <div className="space-y-3 p-2 rounded-lg">
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="text-sm font-semibold">Name</div>
                          <input
                            type="text"
                            value={stockForm.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Name"
                          />
                          {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold">Uom</div>
                          <input
                            type="text"
                            value={stockForm.uom}
                            onChange={(e) => handleInputChange("uom", e.target.value)}
                            className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="ex : pcs, kg, g, ml, l"
                          />
                          {errors.uom && <span className="text-xs text-red-500">{errors.uom}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold">Min. qty</div>
                          <input
                            type="number"
                            value={stockForm.minQty ??""}
                            onChange={(e) => handleInputChange("minQty", e.target.value)}
                            className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="0"
                          />
                          {errors.minQty && <span className="text-xs text-red-500">{errors.minQty}</span>}
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="text-sm font-semibold">Last qty</div>
                          <input
                            type="number"
                            value={stockForm.qty ??""}
                            onChange={(e) => handleInputChange("qty", e.target.value)}
                            className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="0"
                          />
                          {errors.qty && <span className="text-xs text-red-500">{errors.qty}</span>}
                        </div>
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
                  )}

                  {activeTab === "stock" && (
                    <div className="space-y-3 p-2 rounded-lg">
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold">Select Ingredient</div>
                        <select
                          value={stockLogForm.stockId ?? ""}
                          onChange={(e) => {
                            const selectedId = e.target.value
                            handleInputChangeLog("stockId", selectedId)

                            const selectedStock = stockList.find((s:any) => s.id === selectedId)
                            if (selectedStock) {
                              handleInputChangeLog("uom", selectedStock.uom)
                            }
                          }}
                          className="px-2 py-2 border text-sm rounded-lg focus:outline-none focus:ring-1 bg-white"
                        >
                          <option value="" disabled>
                            Choose ingredient
                          </option>
                          {Array.isArray(stockList) &&
                            stockList.map((stock) => (
                              <option key={stock.id} value={stock.id}>
                                {stock.name} - {stock.uom}
                              </option>
                            ))}
                        </select>
                        {logErrors.stockId && <span className="text-xs text-red-500">{logErrors.stockId}</span>}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold">Add stock</div>
                        <input
                          type="number"
                          value={stockLogForm.qty ??""}
                          onChange={(e) => handleInputChangeLog("qty", e.target.value)}
                          className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="0"
                        />
                        {logErrors.qty && <span className="text-xs text-red-500">{logErrors.qty}</span>}
                      </div>
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-1 w-full">
                          <textarea
                            value={stockLogForm.note}
                            onChange={(e) => handleInputChangeLog("note", e.target.value)}
                            className="px-2 py-2 w-full border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                            placeholder="Note"
                          />
                          {logErrors.note && <span className="text-xs text-red-500">{logErrors.note}</span>}
                        </div>
                      </div>
                      <div className="flex justify-center mt-2 gap-2">
                        <button
                          className="p-2 text-sm rounded-lg w-full transition-colors duration-200 bg-neutral-600 text-white px-5"
                          type="button"
                          onClick={handleSubmitLog}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Recently added */}
            <div className="flex flex-col gap-2">
              <div className="text-base font-semibold">Recent activity</div>
              <SearchBar onSearch={handleSearch} />
              <div className="grid gap-1 max-h-96 overflow-auto p-2 bg-white rounded-xl">
                {Array.isArray(recentStocks) &&
                  recentStocks.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-col p-2 py-3 gap-1 bg-white relative border-b"
                    >
                      <span className="text-sm font-semibold">{item.type === 'inbound' ? 'Added' : "Out"} stock</span>
                      <span className="text-xs text-neutral-400">Add {item.qty} {item.uom} of espresso beans</span>
                      {/* Edit button */}
                      <div
                        className="absolute top-2 right-2 text-neutral-300 text-xs px-2 py-2 rounded-lg"
                      >
                        {moment(item.updatedAt).fromNow()}
                      </div>
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

export default Stock;
