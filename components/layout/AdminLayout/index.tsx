"use client";

import { Hero } from "@/components/sections";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import {
  HiHome,
  HiClipboardList,
  HiCurrencyDollar,
  HiClock,
} from "react-icons/hi";
import { getAccessToken } from "@/helpers/getAccessToken";

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const tabs: TabItem[] = [
  { id: "home", label: "Home", icon: HiHome, route: "/admin-cashier-menu" },
  {
    id: "active-order",
    label: "Active Order",
    icon: HiClipboardList,
    route: "/admin-active-order",
  },
  {
    id: "cashflow",
    label: "Cashflow",
    icon: HiCurrencyDollar,
    route: "/admin-cashflow",
  },
  {
    id: "history",
    label: "History",
    icon: HiClock,
    route: "/admin-order-history",
  },
];

const AdminLayout = ({
  children,
  isHome = false,
}: {
  children: React.ReactNode;
  isHome?: boolean;
}) => {
  const isLoggedIn = getAccessToken();
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");

  // Set active tab based on current pathname
  useEffect(() => {
    const currentTab = tabs.find((tab) => tab.route === pathname);
    if (currentTab) {
      setActiveTab(currentTab.id);
    }
  }, [pathname]);

  return (
    <>
      <div className="bg-neutral-50 overflow-auto">
        <div className="absolute h-[160px] z-20 w-full top-0 left-0">
          <Hero isCustomer={false} />

          {/* Tab Navigation */}
          <div className="bg-white border-b border-neutral-200 sticky z-40 mt-20 pt-4">
            <div className="px-4 py-4">
              <nav className="flex gap-2 flex-wrap">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        router.push(tab.route);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "text-white bg-primary-500 shadow-md"
                          : "text-neutral-500 bg-neutral-100 hover:bg-neutral-200 hover:text-neutral-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className={`w-4 h-4`} />
                      <span>{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Content */}
        <div
          className={`px-4 mt-[160px] ${isHome ? "pb-0" : ""}`}
          style={{ height: "calc(100vh - 160px)" }}
        >
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
