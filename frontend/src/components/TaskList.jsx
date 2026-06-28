import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  CheckCircle,
  ClipboardList,
  X,
  Save,
  Plus,
} from "lucide-react";
import TaskForm from "../components/TaskForm";
import Loading from "./Loading";

// Simple status styles helper
const getStatusStyles = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "in-progress":
      return "bg-indigo-100 text-indigo-700 border-indigo-200";
    case "pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

// Toast Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          type === "success"
            ? "bg-green-50 border-green-200 text-green-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={20} className="text-green-600" />
        ) : (
          <X size={20} className="text-red-600" />
        )}
        <p className="font-medium text-sm">{message}</p>
        <button onClick={onClose} className="ml-2 hover:opacity-70">
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

const TaskList = ({
  searchTerm = "",
  refreshTasks,
  filter = "all",
  sortBy = "newest",
}) => {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const tasksPerPage = 3;

  // ✅ Fixed fetchTasks function
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;
      setTasks(Array.isArray(data) ? data : data.tasks || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTasks]);
  const safeSearchTerm = (searchTerm ?? "").toLowerCase();

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = (task.title ?? "")
        .toLowerCase()
        .includes(safeSearchTerm);

      const matchesFilter =
        !filter || filter === "all" || task.status === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortBy === "oldest")
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortBy === "az") return (a.title || "").localeCompare(b.title || "");
      if (sortBy === "za") return (b.title || "").localeCompare(a.title || "");
      return 0;
    });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter, sortBy]);

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handleEdit = async (id) => {
    if (!editedTitle.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/tasks/${id}`,
        { title: editedTitle, description: editedDescription },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      cancelEditing();
      setToast({ message: "Task updated successfully!", type: "success" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setToast({ message: "Failed to update task.", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== id));
      setToast({ message: "Task deleted successfully!", type: "success" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setToast({ message: "Failed to delete task.", type: "error" });
    }
  };

  const handleStatusToggle = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `http://localhost:5000/api/tasks/${task._id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setTasks(tasks.map((task) => (task._id === id ? res.data : task)));
      setToast({
        message:
          newStatus === "completed"
            ? "Task marked as complete!"
            : "Task marked as pending!",
        type: "success",
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      setToast({ message: "Failed to update status.", type: "error" });
    }
  };

  const startEditing = (task) => {
    setEditingId(task._id);
    setEditedTitle(task.title);
    setEditedDescription(task.description || "");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  // handler for when task is added
  const handleTaskAdded = () => {
    setShowTaskForm(false);
    fetchTasks();
    setToast({ message: "Task created successfully!", type: "success" });
  };

  if (loading && tasks.length === 0) {
    return <Loading text="Loading Tasks..." />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">
            <button
              onClick={() => setShowTaskForm(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-2xl">
              <h3 className="text-lg font-bold text-white">Create New Task</h3>
              <p className="text-indigo-200 text-sm">
                Fill in the details below
              </p>
            </div>

            <div className="p-6">
              <TaskForm onTaskAdded={handleTaskAdded} />
            </div>
          </div>
        </div>
      )}

      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="relative mb-6">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl">
              <ClipboardList className="w-14 h-14 text-indigo-400" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full">
              <Plus className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Tasks Yet
          </h2>
          <p className="text-gray-500 text-center max-w-md mb-8">
            Create your first task to start organizing your work.
          </p>
          <button
            onClick={() => setShowTaskForm(true)}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
          >
            <Plus size={20} />
            Create New Task
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {currentTasks.map((task) => (
            <div
              key={task._id}
              className={`group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all duration-200 overflow-hidden ${
                task.status === "completed" ? "opacity-75" : ""
              }`}
            >
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getStatusStyles(task.status)}`}
                    >
                      {task.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(task.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  {editingId === task._id ? (
                    <div className="space-y-3">
                      <input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full text-lg font-semibold text-gray-900 border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        placeholder="Task title"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        rows={2}
                        className="w-full text-sm text-gray-600 border border-indigo-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 resize-none"
                        placeholder="Add a description..."
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(task._id)}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 flex items-center gap-1"
                        >
                          <Save size={14} /> Save
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 flex items-center gap-1"
                        >
                          <X size={14} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3
                        className={`text-lg font-semibold text-gray-900 mb-1 ${task.status === "completed" ? "line-through text-gray-500" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <p
                        className={`text-sm text-gray-500 line-clamp-2 ${task.description ? "" : "italic"}`}
                      >
                        {task.description || "No description provided"}
                      </p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEditing(task)}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleStatusToggle(task)}
                    className={`p-2 rounded-lg transition-colors ${
                      task.status === "completed"
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <CheckCircle size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setTaskToDelete(task._id);
                      setShowDeleteModal(true);
                    }}
                    className="h-10 w-10 rounded-lg border border-gray-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-4">
              <p className="text-sm text-gray-500">
                Showing {indexOfFirstTask + 1} to{" "}
                {Math.min(indexOfLastTask, filteredTasks.length)} of{" "}
                {filteredTasks.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      currentPage === i + 1
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[400px] p-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-800">Delete Task</h2>

            <p className="text-gray-500 mt-3">
              Are you sure you want to delete this task?
            </p>

            <p className="text-red-500 text-sm mt-2">
              This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="px-5 py-2 rounded-lg border hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handleDelete(taskToDelete);
                  setShowDeleteModal(false);
                  setTaskToDelete(null);
                }}
                className="px-5 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
