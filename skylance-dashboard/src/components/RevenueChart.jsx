import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import FilterButton from "./FilterButton";

const RevenueChart = () => {
  const [filter, setFilter] = useState("month");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authToken = localStorage.getItem("authToken");

  const fetchRevenueData = async (period) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Revenue?periodType=${period}`,
        {
          method: "GET",
          headers: {
            "Session-Token": authToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setData(result.data);
        setError(null);
      } else {
        throw new Error("API responded with success: false");
      }
    } catch (err) {
      // console.error("Failed to fetch revenue data:", err.message);
      setError("Failed to fetch revenue data.");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData(filter);
  }, [filter]);

  const totalRevenue = data.reduce((sum, item) => {
    const revenueNum = Number(item.revenue);
    return sum + (isNaN(revenueNum) ? 0 : revenueNum);
  }, 0);

  const formatRevenue = (value) => {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Revenue Growth</h3>
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

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <span className="text-3xl font-bold text-gray-900">
              {formatRevenue(totalRevenue)}
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
        </>
      )}
    </div>
  );
};

export default RevenueChart;
