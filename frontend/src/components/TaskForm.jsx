import { useState } from "react";
import axios from "axios";
import { Plus, X, Save } from "lucide-react";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        { title, 
        description,
        dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Task Created:", res.data);
      
      onTaskAdded(res.data);
      setTitle("");
      setDescription("");
      setIsExpanded(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setIsExpanded(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white border-2 border-gray-200 overflow-hidden"
      >
        {/* Top Section - Title Input */}
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
            required
          />
        </div>

        {/* Bottom Section - Description Input */}
        <div className="p-4 bg-gray-50">
          <textarea
            placeholder="Add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 text-sm text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        </div>
        <div className=" p-3">
          <input
  type="date"
  value={dueDate}
  onChange={(e) => setDueDate(e.target.value)}
  className="w-full border text-gray-400 rounded-lg px-3 py-2"
/>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex items-center justify-between bg-white">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={18} />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={!title.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
          >
            <Save size={18} />
            Save Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;