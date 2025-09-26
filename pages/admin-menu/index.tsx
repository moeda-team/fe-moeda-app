"use client";

import React, { useEffect, useState } from "react";
import { BiSolidBell, BiDollar, BiTrendingUp, BiPlusCircle, BiMenu } from "react-icons/bi";
import { HiChartPie, HiSparkles } from "react-icons/hi";
import nookies from "nookies";
import { AdminLayout } from "@/components/layout";
import { FaClock, FaPercentage } from "react-icons/fa";
import { useMenu } from "@/swr/get/products";
import Card from "./ProductCard";
import { RiDiscountPercentFill } from "react-icons/ri";
import { useRouter } from "next/router";
import { useSummaryDashboard } from "@/swr/get/dashboardAdmin";
import { formatToIDR } from "@/utils/formatCurrency";

const AdminMenu: React.FC = () => {
  const router = useRouter();
  const [customerName, setCustomerName] = useState<string>("");

  useEffect(() => {
    const cookies = nookies.get();
    setCustomerName(cookies.customerName || "Guest");
  }, []);
  const [category, setCategory] = useState<string>('');

  const { menu } = useMenu({
    category: category as string
  });

  const { summaryDashboard } = useSummaryDashboard();

  const listMenu = [
    {
      id : 1,
      name : "Add Menu",
      icon : <BiPlusCircle size={30}/>,
      link : '/admin-menu/menu'
    },
    {
      id : 2,
      name : "Stock",
      icon : <BiMenu size={30}/>,
      link : '/admin-menu/stock'
    },
    {
      id : 3,
      name : "Finance",
      icon : <HiChartPie size={30}/>,
      link : '/admin-menu/finance'
    },
    {
      id : 4,
      name : "History",
      icon : <FaClock size={30}/>,
      link : '/admin-menu/history'
    },
    {
      id : 5,
      name : "Voucher",
      icon : <RiDiscountPercentFill size={30}/>,
      link : '/admin-menu/voucher'
    }
  ]
  return (
    <AdminLayout>
      <div className="flex flex-col gap-4 p-1" style={{ height: "calc(100vh - 180px)" }}>
        {/* Header */}
        <div className="border-neutral-200 sticky top-0 z-10">
          <div className="flex justify-between gap-4 items-center">
            <div>
              <h1 className="lg:text-xl text-lg font-bold text-neutral-900">
                Hello {customerName}
              </h1>
            </div>
            <div className="cursor-pointer">
              <BiSolidBell size={25} />
            </div>
          </div>
        </div>

        {/* Card Session */}
        <div className="grid lg:grid-cols-4 grid-cols-2  lg:gap-4 gap-2">
          {/* Revenue */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
            <div className="flex justify-between">
              <div className="bg-green-200 p-2 rounded-full">
                <BiDollar size={25} className="text-white bg-green-500 p-1 rounded-full"/>
              </div>
              <div className="text-neutral-300 lg:text-xl text-sm">Today</div>
            </div>
            <div className="font-bold lg:text-xl text-sm">{formatToIDR(summaryDashboard?.revenue??0)}</div>
            <div className="text-neutral-300 text-base">Revenue</div>
          </div>

          {/* Top Item */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
            <div className="flex justify-between">
              <div className="bg-yellow-200 p-2 rounded-full">
                <HiSparkles size={25} className="text-white bg-yellow-500 p-1 rounded-full"/>
              </div>
              <div className="text-neutral-300 lg:text-xl text-sm">Top Item</div>
            </div>
            <div className="font-bold lg:text-xl text-sm">
              {summaryDashboard?.topItems?.length > 0
                ? summaryDashboard.topItems[0].menuName
                : "-"}
            </div>
            <div className="text-neutral-300 text-base">
              {summaryDashboard?.topItems?.length > 0
                ? summaryDashboard.topItems[0]._sum?.quantity
                : "-"} Sold
            </div>
          </div>

          {/* Avg Order */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
            <div className="flex justify-between">
              <div className="bg-blue-200 p-2 rounded-full">
                <HiSparkles size={25} className="text-white bg-blue-500 p-1 rounded-full"/>
              </div>
              <div className="text-neutral-300 lg:text-xl text-sm">Avg Order</div>
            </div>
            <div className="font-bold lg:text-xl text-sm">
              {formatToIDR(summaryDashboard?.todayAvg ?? 0)}
            </div>
            {summaryDashboard?.yesterdayAvg ? (
              (() => {
                const avgGrowth = ((summaryDashboard.todayAvg - summaryDashboard.yesterdayAvg) / summaryDashboard.yesterdayAvg) * 100;
                const color = avgGrowth >= 0 ? "text-green-500" : "text-red-500";
                return (
                  <div className={`${color} text-base font-bold`}>
                    {avgGrowth.toFixed(2)}%
                  </div>
                );
              })()
            ) : (
              <div className="text-neutral-300 text-base">-</div>
            )}
          </div>

          {/* Growth */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:gap-2 gap-1">
            <div className="flex justify-between">
              <div className="bg-blue-200 p-1 rounded-full">
                <BiTrendingUp size={30} className="text-white p-1 rounded-full" color="blue"/>
              </div>
              <div className="text-neutral-300 lg:text-xl text-sm">Growth</div>
            </div>
            <div className="font-bold lg:text-xl text-sm">{summaryDashboard?.growth??0}%</div>
            <div className="text-neutral-300 text-base">vs yesterday</div>
          </div>

        </div>

        {/* Menu Lain nya */}
        <div className="text-sm font-semibold">Menu Lainnya</div>
        <div className="grid grid-cols-4 lg:flex sm:flex items-center justify-center py-4 px-2 bg-white rounded-xl shadow-md gap-4">
          {listMenu.map((menu) => (
            <div
              key={menu.id}
              className="flex flex-col items-center justify-center lg:text-sm text-xs font-semibold gap-1 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => router.push(`${menu.link}`)}
            >
              <div className="flex justify-center p-5 bg-neutral-100 rounded-xl">
                {menu.icon}
              </div>
              {menu.name}
            </div>
          ))}
        </div>

        {/* Current Menu */}
        <div className="text-sm font-semibold flex justify-between">
          <p>Menu Lainnya</p>
          <u>Add New</u>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 pb-8">
          {Array.isArray(menu) &&
            menu.map((product, index) => (
              <Card
                key={index}
                id={product.id}
                title={product.name}
                description={product.desc}
                image={product.img}
                quantity={product.quantity}
              />
            ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMenu;
