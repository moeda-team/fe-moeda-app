import { AdminLayout } from "@/components/layout";
import { HalfRadialProgress } from "@/components/ui";
import LineChart from "@/components/ui/LineChart";
import WeeklyOrdersChart from "@/components/ui/WeeklyOrderChart";
import React from "react";

const AdminCashFlow = () => {
  return (
    <AdminLayout isHome>
      <div
        className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden !mt-[170px] flex flex-col"
        style={{ height: "calc(100vh - 180px)" }}
      >
        <div className="p-4 border-neutral-200">
          <h1 className="text-2xl font-bold text-neutral-900">Sales Today</h1>
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-4 h-full min-h-0">
            {/* First HalfRadialProgress */}
            <div className="flex items-center justify-center min-h-[200px]">
              <HalfRadialProgress
                current={50}
                max={100}
                label="Drink(s)"
                color="#2A625A"
              />
            </div>

            {/* Second HalfRadialProgress */}
            <div className="flex items-center justify-center min-h-[200px]">
              <HalfRadialProgress
                current={50}
                max={100}
                label="Food(s)"
                color="#F3A93B"
              />
            </div>

            {/* LineChart - spans 2 columns */}
            <div className="col-span-2 min-h-[342px] flex items-center justify-center">
              <div className="w-full h-full">
                <LineChart
                  rawData={{
                    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                    all: [
                      1200000, 190000, 30000000, 2500000, 21000000, 3500000,
                    ],
                    cash: [800000, 1000000, 1500000, 1300000, 120000, 1700000],
                    qris: [400000, 900000, 1500000, 1200000, 900000, 1800000],
                  }}
                />
              </div>
            </div>

            {/* WeeklyOrdersChart - spans all 4 columns */}
            <div className="col-span-4 bg-gray-50 shadow-md rounded-md p-4 min-h-[300px]">
              <WeeklyOrdersChart
                dailyTarget={200}
                weekData={[
                  { day: "01", drink: 67, food: 16, other: 20 },
                  { day: "02", drink: 17, food: 8, other: 8 },
                  { day: "03", drink: 10, food: 23, other: 46 },
                  { day: "04", drink: 18, food: 12, other: 48 },
                  { day: "05", drink: 33, food: 56, other: 22 },
                  { day: "06", drink: 12, food: 58, other: 22 },
                  { day: "07", drink: 48, food: 12, other: 3 },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCashFlow;
