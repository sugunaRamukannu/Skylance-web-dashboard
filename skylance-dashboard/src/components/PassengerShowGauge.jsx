import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const PassengerShowGauge = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("month");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);

  const fetchData = async (rangeType, year, month = null) => {
    setLoading(true);
    try {
      let url = `${
        import.meta.env.VITE_API_BASE_URL
      }/PassengerShow?range=${rangeType}&year=${year}&method=weighted`;
      if (rangeType === "month" && month) {
        url += `&month=${month}`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success && result.data.length > 0) {
        setData(result.data[0]);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("API Error:", error);
      setData(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData("month", selectedYear, selectedMonth);
  }, []);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setMonthDropdownOpen(false);
    fetchData(
      newFilter,
      selectedYear,
      newFilter === "month" ? selectedMonth : null
    );
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setMonthDropdownOpen(false);
    fetchData("month", selectedYear, month);
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
    fetchData(filter, year, filter === "month" ? selectedMonth : null);
  };

  const formatMonth = (month) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months[month - 1];
  };

  const getDisplayText = () => {
    return filter === "year"
      ? selectedYear.toString()
      : `${formatMonth(selectedMonth)} ${selectedYear}`;
  };

  const chartData = data
    ? [
        { name: "Show", value: data.showPercentage },
        { name: "No Show", value: data.noShowPercentage },
      ]
    : [];

  const COLORS = ["#2563EB", "#BFDBFE"];
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);
  const yearOptions = [2023, 2024, 2025, 2026, 2027];

  return (
    <div className="flex items-start justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-lg mt-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-semibold text-gray-900">
            Passenger Show
          </h3>

          <div className="relative flex space-x-2">
            {/* Month Button */}
            <div className="relative">
              <button
                onClick={() => {
                  if (filter !== "month") {
                    handleFilterChange("month");
                  } else {
                    setMonthDropdownOpen(!monthDropdownOpen);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                  filter === "month"
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter === "month" ? getDisplayText() : "Month"}
                <span className="text-xs">▼</span>
              </button>

              {filter === "month" && monthDropdownOpen && (
                <div className="absolute z-20 mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto min-w-40">
                  <div className="p-2 border-b border-gray-100">
                    <select
                      value={selectedYear}
                      onChange={(e) =>
                        handleYearChange(parseInt(e.target.value))
                      }
                      className="w-full p-1 text-sm border border-gray-200 rounded"
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  {monthOptions.map((month) => (
                    <div
                      key={month}
                      onClick={() => handleMonthChange(month)}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-purple-50 ${
                        month === selectedMonth
                          ? "bg-purple-100 text-purple-700 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {formatMonth(month)} {selectedYear}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Year Button */}
            <button
              onClick={() => handleFilterChange("year")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filter === "year"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter === "year" ? selectedYear : "Year"}
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center h-48 w-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : data ? (
              <>
                <div className="h-48 w-80">
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
                </div>
                <div className="absolute left-1/2 bottom-3 transform -translate-x-1/2 text-center">
                  <div className="text-xl font-bold text-gray-800">
                    {Math.round(data.showPercentage)}%
                  </div>
                  <div className="text-lg text-blue-600 font-medium">Show</div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-48 w-80 text-gray-500">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        {data && (
          <div className="flex justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-blue-600"></div>
              <span className="text-sm font-medium text-gray-700">Show</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2 bg-blue-200"></div>
              <span className="text-sm font-medium text-gray-700">No Show</span>
            </div>
          </div>
        )}

        {/* Stats */}
        {data && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-800">
                  {data.flights || 0}
                </div>
                <div className="text-xs text-gray-500">Total Flights</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {Math.round(data.showPercentage)}%
                </div>
                <div className="text-xs text-gray-500">Show Rate</div>
              </div>
              <div>
                <div className="text-lg font-bold text-red-500">
                  {Math.round(data.noShowPercentage)}%
                </div>
                <div className="text-xs text-gray-500">No Show Rate</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerShowGauge;
