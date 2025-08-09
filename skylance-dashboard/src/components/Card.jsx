import React from "react";
import { TrendingUp } from "lucide-react";

const Card = ({ icon, title, valueToday, percentChange, color }) => {
  return (
    <div
      className={`p-6 rounded-2xl ${color} backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-xl">{icon}</div>
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-white text-2xl font-bold">{valueToday}</p>
          </div>
        </div>
        {percentChange && (
          <div className="flex items-center text-white/90 text-sm">
            <TrendingUp size={16} className="mr-1" />
            {percentChange}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
