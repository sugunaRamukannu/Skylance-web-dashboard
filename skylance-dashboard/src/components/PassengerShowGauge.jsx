import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// Sample data for last 12 months
const monthlyData = {
  "2024-08": { boarded: 78, noShow: 22 },
  "2024-09": { boarded: 80, noShow: 20 },
  "2024-10": { boarded: 75, noShow: 25 },
  "2024-11": { boarded: 77, noShow: 23 },
  "2024-12": { boarded: 79, noShow: 21 },
  "2025-01": { boarded: 81, noShow: 19 },
  "2025-02": { boarded: 83, noShow: 17 },
  "2025-03": { boarded: 84, noShow: 16 },
  "2025-04": { boarded: 80, noShow: 20 },
  "2025-05": { boarded: 82, noShow: 18 },
  "2025-06": { boarded: 85, noShow: 15 },
  "2025-07": { boarded: 86, noShow: 14 },
};

const yearlyData = { boarded: 82, noShow: 18 };

const formatMonthYear = (monthYear) => {
  const [year, month] = monthYear.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "numeric" });
};

const PassengerShowGauge = () => {
  const [filter, setFilter] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState("2025-07");
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const data = filter === "year" ? yearlyData : monthlyData[selectedMonth];

  const chartData = [
    { name: "Show", value: data.boarded },
    { name: "No Show", value: 100 - data.boarded },
  ];

  const COLORS = ["#2563EB", "#BFDBFE"];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-2xl p-6 shadow-lg border border-blue-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Passenger Show</h3>
        <div className="relative flex space-x-2">
          {/* Month Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setFilter("month");
                setMonthDropdownOpen(!monthDropdownOpen);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === "month"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-100"
              }`}
            >
              {filter === "month" ? formatMonthYear(selectedMonth) : "Month"} ▼
            </button>

            {/* Dropdown */}
            {filter === "month" && monthDropdownOpen && (
              <div className="absolute z-10 mt-1 w-40 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {Object.keys(monthlyData).map((monthKey) => (
                  <div
                    key={monthKey}
                    onClick={() => {
                      setSelectedMonth(monthKey);
                      setMonthDropdownOpen(false);
                    }}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-purple-100 ${
                      monthKey === selectedMonth
                        ? "bg-purple-100 font-semibold"
                        : ""
                    }`}
                  >
                    {formatMonthYear(monthKey)}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Year Button */}
          <button
            onClick={() => {
              setFilter("year");
              setMonthDropdownOpen(false);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              filter === "year"
                ? "bg-purple-600 text-white"
                : "bg-white text-purple-600 border border-purple-300 hover:bg-purple-100"
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={70}
              outerRadius={90}
              dataKey="value"
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute left-1/2 bottom-[8%] transform -translate-x-1/2 text-center">
          <div className="text-3xl font-bold text-blue-900">
            {data.boarded}%
          </div>
          <div className="text-sm text-blue-700">Show</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-blue-900">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassengerShowGauge;
