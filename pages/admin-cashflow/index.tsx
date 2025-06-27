import { AdminLayout } from "@/components/layout";
import { HalfRadialProgress } from "@/components/ui";
import LineChart from "@/components/ui/LineChart";
import WeeklyOrdersChart from "@/components/ui/WeeklyOrderChart";
import { getCashFlow } from "@/swr/get/cashFlow";
import moment from "moment";
import React, { useMemo, useState } from "react";

const AdminCashFlow = () => {
  const [selectedStartDate, setSelectedStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [method, setMethod] = useState<
    "daily" | "weekly" | "monthly" | "annually" | "range"
  >("weekly");
  const {
    cashFlow: { data: cashFlow },
  } = getCashFlow(method, selectedStartDate, selectedEndDate, "cashflow");
  const {
    cashFlow: { data: summaryCategory },
  } = getCashFlow(method, selectedStartDate, selectedEndDate, "category");

  const cashFlowLine: {
    legend: string[];
    dataSetsAll: number[];
    dataSetsCash: number[];
    dataSetsQris: number[];
  } = useMemo(() => {
    let data = {
      legend: [],
      dataSetsAll: [],
      dataSetsCash: [],
      dataSetsQris: [],
    };
    if (!Array.isArray(cashFlow)) return data;

    let dateInformation: any;
    const dataSetAll = cashFlow.map((cash: any) => {
      return cash.paymentMethodGroup.reduce((acc: number, curr: any) => {
        return curr.total + acc;
      }, 0);
    });

    const dataQrisAll = cashFlow
      .flatMap((cash: any) =>
        cash.paymentMethodGroup.filter((p: any) => p.name === "qris")
      )
      .map((entry: any) => entry.total);

    const dataCashAll = cashFlow
      .flatMap((cash: any) =>
        cash.paymentMethodGroup.filter((p: any) => p.name === "cash")
      )
      .map((entry: any) => entry.total);

    if (method === "range") {
      dateInformation = cashFlow.map((cash: any) => {
        return moment(cash.date).format("dddd DD-MM-YYYY");
      });
    }

    if (["daily", "weekly"].includes(method)) {
      dateInformation = cashFlow.map((cash: any) => {
        return moment(cash.date).format("dddd");
      });
    }

    if (method === "monthly") {
      dateInformation = cashFlow.map((cash: any) => {
        return moment(cash.date).format("DD");
      });
    }

    if (method === "annually") {
      dateInformation = cashFlow.map((cash: any) => {
        return cash.date;
      });
    }

    return {
      legend: dateInformation,
      dataSetsAll: dataSetAll,
      dataSetsCash: dataCashAll,
      dataSetsQris: dataQrisAll,
    };
  }, [cashFlow, method]);

  const rawCategoryProgressCart: any = useMemo(() => {
    let data = [
      {
        appetizerCount: 0,
        name: "Appetizer",
      },
      {
        riceBowlCount: 0,
        name: "Rice Bowl",
      },
      {
        pastaCount: 0,
        name: "Pasta",
      },
      {
        mainCourseAsianCount: 0,
        name: "Main Course (Asian)",
      },
      {
        milkBaseCount: 0,
        name: "Milk Base",
      },
      {
        teaCount: 0,
        name: "Tea",
      },
      {
        espressoCount: 0,
        name: "Espresso",
      },
      {
        signatureCoffeeCount: 0,
        name: "Signature Coffee",
      },
    ];
    if (!Array.isArray(summaryCategory)) return data;

    const acc = summaryCategory.reduce<any>(
      (totals, { categoryGroup }) => {
        categoryGroup.forEach(({ name, count }: any) => {
          if (name === "Signature Coffee") totals.appetizerCount += count;
          if (name === "Rice Bowl") totals.riceBowlCount += count;
          if (name === "Pasta") totals.pastaCount += count;
          if (name === "Main Course (Asian)")
            totals.mainCourseAsianCount += count;
          if (name === "Milk Base") totals.milkBaseCount += count;
          if (name === "Tea") totals.teaCount += count;
          if (name === "Espresso") totals.espressoCount += count;
          if (name === "Signature Coffee") totals.signatureCoffeeCount += count;
        });
        return totals;
      },
      {
        appetizerCount: 0,
        riceBowlCount: 0,
        pastaCount: 0,
        mainCourseAsianCount: 0,
        milkBaseCount: 0,
        teaCount: 0,
        espressoCount: 0,
        signatureCoffeeCount: 0,
      }
    );

    return [
      {
        appetizerCount: acc.appetizerCount,
        name: "Appetizer",
      },
      {
        riceBowlCount: acc.riceBowlCount,
        name: "Rice Bowl",
      },
      {
        pastaCount: 0,
        name: "Pasta",
      },
      {
        mainCourseAsianCount: acc.mainCourseAsianCount,
        name: "Main Course (Asian)",
      },
      {
        milkBaseCount: acc.milkBaseCount,
        name: "Milk Base",
      },
      {
        teaCount: acc.teaCount,
        name: "Tea",
      },
      {
        espressoCount: acc.espressoCount,
        name: "Espresso",
      },
      {
        signatureCoffeeCount: acc.signatureCoffeeCount,
        name: "Signature Coffee",
      },
    ];
  }, [summaryCategory, method]);

  const categoryProgressCart = rawCategoryProgressCart.map((item: any) => {
    const [key, value] = Object.entries(item).find(([k]) => k !== "name")!;
    return {
      name: item.name,
      dataSets: value,
      color: "#f59e0b", // Pick a color or map category name to a specific color
    };
  });

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedStartDate(e.target.value);
  };
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEndDate(e.target.value);
  };

  return (
    <AdminLayout isHome>
      <div
        className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden !mt-[170px] flex flex-col"
        style={{ minHeight: "calc(100vh - 180px)" }}
      >
        <div className="p-4 border-neutral-200 flex gap-2 items-center">
          <h1 className="text-2xl font-bold text-neutral-900">Sales Today</h1>

          <select
            id="sales-method"
            value={method}
            onChange={(e) =>
              setMethod(
                e.target.value as
                  | "daily"
                  | "weekly"
                  | "monthly"
                  | "annually"
                  | "range"
              )
            }
            className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900"
          >
            <option value="range">Range</option>
            <option value="annually">Anual</option>
            <option value="monthly">Per Bulan</option>
            <option value="weekly">Per Minggu</option>
            <option value="daily">Per Hari</option>
          </select>
          <input
            id="sales-date"
            type="date"
            value={selectedStartDate}
            onChange={handleStartDateChange}
            className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900"
          />
          <span>-</span>
          <input
            id="sales-date"
            type="date"
            value={selectedEndDate}
            onChange={handleEndDateChange}
            className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-neutral-900"
          />
        </div>

        <div className="flex-1 p-4 overflow-auto">
          <div className="space-y-6">
            {/* Top row - Radial Progress components */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* First HalfRadialProgress */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-8 gap-4 h-full col-span-4">
                {Array.isArray(categoryProgressCart) &&
                  categoryProgressCart.length > 0 &&
                  categoryProgressCart.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-center min-h-[100px] bg-gray-50 rounded-lg p-4"
                    >
                      <HalfRadialProgress
                        current={category.dataSets}
                        max={100}
                        label={category.name}
                        color={category.color}
                      />
                    </div>
                  ))}
              </div>

              {/* LineChart - spans remaining columns on larger screens */}
              <div className="col-span-4 min-h-[342px] flex items-center justify-center rounded-lg p-4 bg-gray-50">
                <div className="w-full h-full">
                  <LineChart
                    rawData={{
                      labels: cashFlowLine.legend,
                      all: cashFlowLine.dataSetsAll,
                      cash: cashFlowLine.dataSetsCash,
                      qris: cashFlowLine.dataSetsQris,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* WeeklyOrdersChart - full width */}
            {/* <div className="w-full bg-gray-50 shadow-md rounded-md p-4 min-h-[300px]">
              <div className="overflow-x-auto">
                <WeeklyOrdersChart
                  dailyTarget={100}
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
            </div> */}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCashFlow;
