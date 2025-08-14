import { useState, useEffect } from "react";
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

const TicketSalesBarChart = () => {
  const [filter, setFilter] = useState("month");
  const [data, setData] = useState([]);
  const [airlines, setAirlines] = useState([]);
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/TicketSales?periodType=${filter}`,
          {
            method: "GET",
            headers: {
              "Session-Token": authToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Fetch error:", text);
          return;
        }

        const result = await response.json();

        if (result.status === "success") {
          setData(result.data);

          // Extract dynamic airline names from the first data entry (excluding "period")
          const dynamicAirlines = Object.keys(result.data[0]).filter(
            (key) => key !== "period"
          );
          setAirlines(dynamicAirlines);
        } else {
          console.error("API error:", result.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchSalesData();
  }, [filter]);

  const getTotalTickets = () => {
    return data.reduce((sum, entry) => {
      return (
        sum +
        airlines.reduce((subSum, airline) => subSum + (entry[airline] || 0), 0)
      );
    }, 0);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Total Sales</h3>
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
          {getTotalTickets().toLocaleString()}
        </span>
        <span className="text-gray-500 ml-2">Total Sales</span>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[...data].reverse()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="airline1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="airline2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="airline3" x1="0" y1="0" x2="0" y2="1">
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
              formatter={(value, name) => [value.toLocaleString(), name]}
            />

            {/* Dynamically render Bars using available airlines */}
            {airlines.map((airline, index) => (
              <Bar
                key={airline}
                dataKey={airline}
                fill={`url(#airline${index + 1})`}
                radius={[4, 4, 0, 0]}
                name={airline}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 mt-4">
        {airlines.map((airline, index) => (
          <div className="flex items-center" key={airline}>
            <div
              className={`w-3 h-3 rounded-full mr-2 ${
                index === 0
                  ? "bg-gradient-to-r from-blue-400 to-blue-500"
                  : index === 1
                  ? "bg-gradient-to-r from-green-400 to-green-500"
                  : "bg-gradient-to-r from-yellow-400 to-orange-500"
              }`}
            />
            <span className="text-sm text-gray-600">{airline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketSalesBarChart;
