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
      console.log("API Response:", result); // Debug log

      if (result.success && result.data) {
        let filteredData = result.data;

        // Process and clean the data
        filteredData = filteredData.map((item) => ({
          period: item.period?.toString() || "",
          revenue: Number(item.revenue) || 0,
        }));

        // Sort data based on period type
        if (period === "year") {
          filteredData = [...filteredData]
            .sort((a, b) => Number(a.period) - Number(b.period))
            .slice(-4);
        } else if (period === "month") {
          // Sort months in ascending order and reverse to display left to right
          filteredData = [...filteredData]
            .sort((a, b) => {
              const dateA = new Date(a.period);
              const dateB = new Date(b.period);
              return dateA - dateB;
            })
            .reverse(); // Add reverse to display months from earliest to latest (left to right)
        }

        console.log("Processed Data:", filteredData); // Debug log
        setData(filteredData);
        setError(null);
      } else {
        throw new Error("API responded with success: false or no data");
      }
    } catch (err) {
      console.error("Fetch error:", err); // Debug log
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

  const formatTooltip = (value, name, props) => {
    return [`${(value / 1000).toFixed(0)}K`, "Revenue"];
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
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No data available</p>
        </div>
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
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="period" stroke="#666" interval={0} />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={formatTooltip}
                  labelStyle={{ color: "#666" }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: "#10b981", strokeWidth: 2 }}
                  connectNulls={false}
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
