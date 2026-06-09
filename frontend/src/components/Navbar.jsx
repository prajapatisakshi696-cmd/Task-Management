import React from "react";
import { Search, Bell, ChevronDown, LogOut } from "lucide-react";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Title */}
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button className="relative p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
          <Bell size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-800">
              {user?.name || "Guest"}
            </p>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-100 transition-all">
              <div className="w-9 h-9 rounded-full bg-blue-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center text-sm font-bold text-blue-600">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  user?.name?.charAt(0).toUpperCase() || "G"
                )}
              </div>
              <ChevronDown
                size={16}
                className="text-gray-400 hidden sm:block"
              />
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-2">
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  onClick={() => {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
