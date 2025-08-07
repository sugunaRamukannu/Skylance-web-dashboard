import { useState } from "react";
import FilterButton from "./FilterButton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Updated sales data for histogram with three airlines
const salesData = {
  // week: [
  //   { period: "Mon", AA: 400, DL: 380, UA: 420 },
  //   { period: "Tue", AA: 600, DL: 550, UA: 650 },
  //   { period: "Wed", AA: 300, DL: 280, UA: 320 },
  //   { period: "Thu", AA: 730, DL: 700, UA: 770 },
  //   { period: "Fri", AA: 930, DL: 900, UA: 970 },
  //   { period: "Sat", AA: 1070, DL: 1030, UA: 1100 },
  //   { period: "Sun", AA: 970, DL: 930, UA: 1000 },
  // ],
  month: [
    { period: "Jan", AA: 4000, DL: 3800, UA: 4200 },
    { period: "Feb", AA: 6000, DL: 5500, UA: 6500 },
    { period: "Mar", AA: 5000, DL: 4800, UA: 5200 },
    { period: "Apr", AA: 7300, DL: 7000, UA: 7800 },
    { period: "May", AA: 8300, DL: 8000, UA: 8500 },
    { period: "Jun", AA: 9300, DL: 9000, UA: 9800 },
  ],
  year: [
    { period: "2020", AA: 60000, DL: 58000, UA: 62000 },
    { period: "2021", AA: 73300, DL: 70000, UA: 76700 },
    { period: "2022", AA: 93300, DL: 90000, UA: 96700 },
    { period: "2023", AA: 106700, DL: 103000, UA: 110000 },
    { period: "2024", AA: 116700, DL: 113000, UA: 120000 },
  ],
};

const TicketSalesBarChart = () => {
  const [filter, setFilter] = useState("month");
  //the actual data to be shown in the chart depends on the filter
  const data = salesData[filter];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Ticket Sales</h3>
        <div className="flex space-x-2">
          {["month", "year"].map((period) => (
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
          {data
            .reduce((sum, item) => sum + item.AA + item.DL + item.UA, 0)
            .toLocaleString()}
        </span>
        <span className="text-gray-500 ml-2">Total Tickets</span>
      </div>

      <div className="h-64 ">
        {/* makes the chart resize automatically based on screen size */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              {/* Light Blue Gradient for American Airlines */}
              {/*  define a smooth transition of colors (gradient) that can be applied to the bars in the chart.
               */}
              <linearGradient
                id="lightBlueGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {/* Defines a point in the gradient where a specific color is applied.multiple points to get smoother effect */}
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={1} />
              </linearGradient>

              {/* Light Green Gradient for Delta Airlines */}
              <linearGradient
                id="lightGreenGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={1} />
              </linearGradient>

              {/* Light Orange Gradient for United Airlines */}
              <linearGradient
                id="lightOrangeGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#F59E0B" stopOpacity={1} />
              </linearGradient>
            </defs>

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
              formatter={(value, name) => [
                value.toLocaleString(),
                name === "AA"
                  ? "American Airlines"
                  : name === "DL"
                  ? "Delta Airlines"
                  : "United Airlines",
              ]}
            />

            {/* Three Bar components for different airlines */}
            <Bar
              dataKey="AA"
              fill="url(#lightBlueGradient)"
              radius={[4, 4, 0, 0]}
              name="AA"
            />
            <Bar
              dataKey="DL"
              fill="url(#lightGreenGradient)"
              radius={[4, 4, 0, 0]}
              name="DL"
            />
            <Bar
              dataKey="UA"
              fill="url(#lightOrangeGradient)"
              radius={[4, 4, 0, 0]}
              name="UA"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend with matching colors */}
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2 bg-gradient-to-r from-blue-400 to-blue-500" />
          <span className="text-sm text-gray-600">American Airlines (AA)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2 bg-gradient-to-r from-green-400 to-green-500" />
          <span className="text-sm text-gray-600">Delta Airlines (DL)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2 bg-gradient-to-r from-yellow-400 to-orange-500" />
          <span className="text-sm text-gray-600">United Airlines (UA)</span>
        </div>
      </div>
    </div>
  );
};

export default TicketSalesBarChart;
