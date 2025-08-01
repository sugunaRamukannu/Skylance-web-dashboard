import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const revenueData = {
  week: [
    { period: "Mon", revenue: 120000 },
    { period: "Tue", revenue: 180000 },
    { period: "Wed", revenue: 90000 },
    { period: "Thu", revenue: 220000 },
    { period: "Fri", revenue: 280000 },
    { period: "Sat", revenue: 320000 },
    { period: "Sun", revenue: 290000 },
  ],
  month: [
    { period: "Jan", revenue: 1200000 },
    { period: "Feb", revenue: 1800000 },
    { period: "Mar", revenue: 1500000 },
    { period: "Apr", revenue: 2200000 },
    { period: "May", revenue: 2500000 },
    { period: "Jun", revenue: 2800000 },
  ],
  year: [
    { period: "2020", revenue: 18000000 },
    { period: "2021", revenue: 22000000 },
    { period: "2022", revenue: 28000000 },
    { period: "2023", revenue: 32000000 },
    { period: "2024", revenue: 35000000 },
  ],
};

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active
        ? "bg-blue-500 text-white shadow-md"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {children}
  </button>
);

const RevenueGrowthChart = () => {
  const [filter, setFilter] = useState("month");
  const data = revenueData[filter];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Revenue Growth</h3>
        <div className="flex space-x-2">
          {["week", "month", "year"].map((period) => (
            <FilterButton
              key={period}
              active={filter === period}
              onClick={() => setFilter(period)}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </FilterButton>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-gray-900">
          $
          {(
            data.reduce((sum, item) => sum + item.revenue, 0) / 1000000
          ).toFixed(1)}
          M
        </span>
        <span className="text-gray-500 ml-2">Total Revenue</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => [
                `$${(value / 1000).toFixed(0)}K`,
                "Revenue",
              ]}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueGrowthChart;
