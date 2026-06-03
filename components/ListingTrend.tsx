"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type TrendItem = {
  month: string;
  price: number;
};

type Props = {
  data: TrendItem[];
  label?: string;
};

const formatNumber = (num: number) =>
  new Intl.NumberFormat("en-US").format(num);

export default function ListingTrend({ data, label }: Props) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-[22px] font-semibold text-gray-900 mb-4">Trends</h2>

      <div className="mb-5">
        <h3 className="text-[16px] font-semibold text-gray-900">Price Trend</h3>
        <p className="text-[13px] text-gray-500">
          View the listing price trends of similar properties
        </p>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#e5e7eb" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={formatNumber}
              width={80}
            />

            <Tooltip
              formatter={(value: any) => {
                if (typeof value === "number") {
                  return [`AED ${formatNumber(value)}`, "Price"];
                }
                return [value, "Price"];
              }}
            />

            <Line
              type="monotone"
              dataKey="price"
              stroke="#1c63f3"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center gap-2 mt-4 text-[13px] text-gray-600">
        <span className="w-8 h-[2px] bg-brand" />
        <span>{label || "Price Trend"}</span>
      </div>
    </div>
  );
}
