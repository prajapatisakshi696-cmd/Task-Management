import React from "react";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  Timer,
  Check,
  CheckCircle
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      name: "All Tasks",
      icon: <ClipboardList size={20} />,
      path: "/dashboard?filter=all",
    },
    {
      name: "Pending Tasks",
      icon: <Timer size={20} />,
      path: "/dashboard?filter=pending",
    },
    {
      name: "Completed Tasks",
      icon: <Check size={20} />,
      path: "/dashboard?filter=completed",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white shadow-2xl">
      {/* Logo */}
  <div className="p-6 border-b border-slate-700">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
        <CheckCircle className="w-6 h-6 text-white" />
      </div>
      
      <div>
        <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        <p className="text-xs text-gray-400">Task Manager</p>
      </div>
    </div>
  </div>

      {/* Menu */}
      <div className="px-4 py-6">
        <p className="text-xs text-gray-400 uppercase mb-4">Manage</p>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname + location.search === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.name === "Dashboard"
                    ? "bg-blue-600 shadow-lg text-white"
                    : location.pathname + location.search === item.path
                      ? "bg-slate-700 text-white"
                      : "hover:bg-slate-800 text-gray-300"
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Account Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-slate-700">
        <p className="text-xs text-gray-400 uppercase mb-3">Account</p>

        <div className="space-y-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition cursor-pointer"
          >
            <User size={20} />
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-600 transition text-left cursor-pointer"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
