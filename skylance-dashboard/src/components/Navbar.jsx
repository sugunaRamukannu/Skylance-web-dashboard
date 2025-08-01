import React from "react";
import { Bell, Settings, Search, User } from "lucide-react";

const Navbar = () => {
  return (
    <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search flights, passengers..."
            className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
          />
        </div> */}
      </div>

      {/* Right side - User info and notifications */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button>

        {/* Settings
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Settings size={20} className="text-gray-600" />
        </button> */}

        {/* User profile */}
        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">Liu Zhang</p>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User size={16} className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
