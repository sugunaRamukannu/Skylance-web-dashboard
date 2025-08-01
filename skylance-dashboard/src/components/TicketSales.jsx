import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const salesData = {
  week: [
    { period: "Mon", tickets: 1200 },
    { period: "Tue", tickets: 1800 },
    { period: "Wed", tickets: 900 },
    { period: "Thu", tickets: 2200 },
    { period: "Fri", tickets: 2800 },
    { period: "Sat", tickets: 3200 },
    { period: "Sun", tickets: 2900 }
  ],
  month: [
    { period: "Jan", tickets: 12000 },
    { period: "Feb", tickets: 18000 },
    { period: "Mar", tickets: 15000 },
    { period: "Apr", tickets: 22000 },
    { period: "May", tickets: 25000 },
    { period: "Jun", tickets: 28000 }
  ],
  year: [
    { period: "2020", tickets: 180000 },
    { period: "2021", tickets: 220000 },
    { period: "2022", tickets: 280000 },
    { period: "2023", tickets: 320000 },
    { period: "2024", tickets: 350000 }
  ]
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

const TicketSalesCard = () => {
  const [filter, setFilter] = useState("month");
  const data = salesData[filter];
  
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Ticket Sales</h3>
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
          {data.reduce((sum, item) => sum + item.tickets, 0).toLocaleString()}
        </span>
        <span className="text-gray-500 ml-2">Total Tickets</span>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="period" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="tickets" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TicketSalesCard;