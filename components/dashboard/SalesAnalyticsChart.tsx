"use client"

import { SalesItem } from "@/lib/api/report/req-api"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

interface SalesAnalyticsChartProps {
  data: SalesItem[]
  dataKey?: keyof SalesItem
}

export default function SalesAnalyticsChart({
  data,
  dataKey = "transactions_amount",
}: SalesAnalyticsChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <LineChart data={data}>

          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) =>
              value >= 1000 ? `${value / 1000}k` : value
            }
          />

          <Tooltip
            formatter={(value: number) => [
              `Rp ${value.toLocaleString("id-ID")}`,
              "Transaction Amount",
            ]}
          />

          <Line
            type="linear"
            dataKey={dataKey}
            stroke="#b36b3f"
            strokeWidth={2}
            dot={true}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}