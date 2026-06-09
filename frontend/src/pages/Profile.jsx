import React from "react";
import { User, Mail, Calendar } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">No user found. Please log in.</p>
      </div>
    );
  }

  return (
  
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Navbar />


    <div className="ml-64 min-h-screen bg-gray-50 p-8 flex justify-center items-start">


      <div className="max-w-lg w-full bg-white rounded-2xl shadow-md overflow-hidden">
        {/* Top Banner */}
        <div className="h-24 bg-gradient-to-r from-indigo-500 to-blue-500"></div>

        <div className="px-8 pb-8">
          {/* Avatar Section*/}
          <div className="relative flex justify-center -mt-12 mb-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

          {/* User Info Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">Task Manager User</p>
          </div>

          {/* Details List */}
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                <User size={20} />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-400">Full Name</p>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                <Mail size={20} />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="p-2 bg-white rounded-lg shadow-sm text-gray-400">
                <Calendar size={20} />
              </div>
              <div className="ml-4">
                <p className="text-xs text-gray-400">Member Since</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Profile;