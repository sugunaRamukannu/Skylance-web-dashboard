import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  Settings,
  Search,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear authentication data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("tokenExpiry");

    // Update authentication state
    setIsAuthenticated(false);

    // Close dropdown
    setIsUserMenuOpen(false);

    // Navigate to login page
    navigate("/login");
  };

  return (
    <div className="h-16 px-6 flex items-center justify-between bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </button> */}

        {/* Settings - uncomment if needed
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors"> 
          <Settings size={20} className="text-gray-600" /> 
        </button> */}

        {/* User profile with dropdown */}
        <div className="relative" ref={userMenuRef}>
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Liu Zhang</p>
            </div>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              {/* <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Liu Zhang</p>
              </div>

              <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User size={16} />
                <span>Profile</span>
              </button> */}

              <hr className="my-1 border-gray-100" />

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-white 
             bg-gradient-to-r from-blue-500 to-purple-600 
             hover:from-blue-600 hover:to-purple-700 
             rounded-md transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
