import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import clsx from "clsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

const filters = ["All", "Cash", "QRIS"] as const;
type FilterType = (typeof filters)[number];

const LineChart = ({ rawData }: { rawData: any }) => {
  const [filter, setFilter] = useState<FilterType>("All");

  const getDataByFilter = () => {
    let dataset: any = [];

    if (filter === "All") {
      dataset = [
        {
          label: "Cash",
          data: rawData.cash,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "QRIS",
          data: rawData.qris,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ];
    } else if (filter === "Cash") {
      dataset = [
        {
          label: "Cash",
          data: rawData.cash,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ];
    } else if (filter === "QRIS") {
      dataset = [
        {
          label: "QRIS",
          data: rawData.qris,
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ];
    }

    return {
      labels: rawData.labels,
      datasets: dataset,
    };
  };

  const renderIndicators = () => {
    const typesToRender = filter === "All" ? ["Cash", "QRIS"] : [filter];

    const colorMap: Record<string, string> = {
      Cash: "#3b82f6",
      QRIS: "#10b981",
    };

    return (
      <div className="flex justify-center gap-6 mt-6">
        {typesToRender.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: colorMap[type] }}
            ></span>
            <span className="text-sm text-gray-700 font-medium">{type}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-md p-6 h-full">
      <div className="flex justify-between">
        <h4 className="text-base font-medium text-gray-800 mb-4">
          Sales Overview
        </h4>

        <div className="flex space-x-3 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                "px-4 py-2 rounded-md text-sm font-medium transition-all",
                filter === f
                  ? "bg-primary-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart with fixed height */}
      <div className="h-[250px]">
        <Line
          data={getDataByFilter()}
          options={{
            responsive: true,
            maintainAspectRatio: false, // important
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                ticks: { color: "#6b7280" },
                grid: { display: false },
              },
              y: {
                min: Math.min(
                  getDataByFilter()?.datasets
                    ? getDataByFilter()?.datasets[0]?.data
                    : 0,
                  getDataByFilter()?.datasets
                    ? getDataByFilter()?.datasets[1]?.data
                    : 0
                ),
                max: Math.max(
                  getDataByFilter()?.datasets
                    ? getDataByFilter()?.datasets[0]?.data
                    : 0,
                  getDataByFilter()?.datasets
                    ? getDataByFilter()?.datasets[1]?.data
                    : 0
                ),
                ticks: {
                  stepSize:
                    Math.max(
                      getDataByFilter()?.datasets
                        ? getDataByFilter()?.datasets[0]?.data
                        : 0,
                      getDataByFilter()?.datasets
                        ? getDataByFilter()?.datasets[1]?.data
                        : 0
                    ) / 10,
                  color: "#6b7280",
                  callback: (value: any) => value / 1000 + "k",
                },
                grid: { display: false },
              },
            },
          }}
        />
      </div>

      {renderIndicators()}
    </div>
  );
};

export default LineChart;
