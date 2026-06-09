import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useSearchParams } from "react-router-dom";
import {
  ClipboardList,
  CheckCircle,
  Clock,
  Search,
  SlidersHorizontal,
  Plus,
  TrendingUp,
} from "lucide-react";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [refreshTasks, setRefreshTasks] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }

        const data = await res.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [refreshTasks]);

  // --- Stats Card Component ---
  const StatCard = ({ icon, title, count, color, change, delay }) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      amber: "from-amber-500 to-amber-600",
      purple: "from-purple-500 to-purple-600",
    };

    const bgMap = {
      blue: "bg-blue-50",
      green: "bg-green-50",
      amber: "bg-amber-50",
      purple: "bg-purple-50",
    };

    const textMap = {
      blue: "text-blue-600",
      green: "text-green-600",
      amber: "text-amber-600",
      purple: "text-purple-600",
    };

    return (
      <div 
        className="group relative overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out cursor-default"
        style={{ animationDelay: `${delay}ms` }}
      >
        {/* Gradient Background Effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        <div className="relative p-6">
          <div className="flex items-start justify-between">
            <div className={`p-4 rounded-2xl ${bgMap[color]} ${textMap[color]} group-hover:scale-110 transition-transform duration-300`}>
              {React.cloneElement(icon, { size: 24 })}
            </div>
            {change && (
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 rounded-full">
                <TrendingUp size={12} />
                <span className="text-xs font-bold">{change}</span>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500">{title}</h3>
            <p className="text-4xl font-bold text-gray-900 mt-1">{count}</p>
          </div>
        </div>
      </div>
    );
  };

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasks = tasks.filter((t) => t.status === "pending").length;
  
  // Calculate progress percentage
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        <Navbar />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back! 👋</h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your tasks today.</p>
              </div>
              
              {/* Progress Ring */}
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="3"
                      strokeDasharray={`${progress}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-gray-900">{progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completion</p>
                  <p className="text-lg font-bold text-gray-900">{completedTasks} / {totalTasks}</p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <StatCard 
                icon={<ClipboardList />} 
                title="Total Tasks" 
                count={totalTasks} 
                color="blue" 
                change="+12%" 
                delay={0}
              />
              <StatCard 
                icon={<CheckCircle />} 
                title="Completed" 
                count={completedTasks} 
                color="green" 
                change="+8%" 
                delay={100}
              />
              <StatCard 
                icon={<Clock />} 
                title="Pending" 
                count={pendingTasks} 
                color="amber" 
                change="-4%" 
                delay={200}
              />
            </div>

            {/* Task List Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Toolbar */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left: Title */}
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <ClipboardList size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">All Tasks</h2>
                    <p className="text-xs text-gray-500">{totalTasks} tasks found</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search tasks..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full sm:w-[220px] pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowFilter(!showFilter)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                      <SlidersHorizontal size={16} />
                      <span>{sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : sortBy === "az" ? "A → Z" : "Z → A"}</span>
                    </button>

                    {showFilter && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="p-2">
                          <button onClick={() => { setSortBy("newest"); setShowFilter(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Newest</button>
                          <button onClick={() => { setSortBy("oldest"); setShowFilter(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Oldest</button>
                          <button onClick={() => { setSortBy("az"); setShowFilter(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">A → Z</button>
                          <button onClick={() => { setSortBy("za"); setShowFilter(false); }} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Z → A</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-indigo-600/25 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                  >
                    <Plus size={18} />
                    <span>Add Task</span>
                  </button>
                </div>
              </div>

              {/* Task Form Modal */}
              {showTaskForm && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                      <h3 className="text-lg font-bold text-gray-900">Create New Task</h3>
                      <button
                        onClick={() => setShowTaskForm(false)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="p-6">
                      <TaskForm
                        onTaskAdded={() => {
                          setRefreshTasks(!refreshTasks);
                          setShowTaskForm(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Task List */}
              <div className="p-6 min-h-[400px]">
                <TaskList
                  searchTerm={searchTerm}
                  sortBy={sortBy}
                  refreshTasks={refreshTasks}
                  filter={filter}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;