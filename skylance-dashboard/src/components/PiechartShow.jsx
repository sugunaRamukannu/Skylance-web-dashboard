import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const noShowData = {
  week: { boarded: 85, noShow: 15 },
  month: { boarded: 78, noShow: 22 },
  year: { boarded: 82, noShow: 18 }
};

const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-blue-500 text-white shadow-md' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const PieChartNoShow = () => {
  const [filter, setFilter] = useState("month");
  const data = noShowData[filter];
  
  const chartData = [
    { name: "Boarded", value: data.boarded },
    { name: "No Show", value: data.noShow }
  ];
  
  const COLORS = ["#3b82f6", "#ef4444"];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Passenger No-Show</h3>
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
      
      <div className="relative h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{data.boarded}%</div>
            <div className="text-sm text-gray-500">Boarded</div>
          </div>
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
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieChartNoShow;