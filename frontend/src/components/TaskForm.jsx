import { useState } from "react";
import axios from "axios";
import { X, Save } from "lucide-react";

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

if (!title.trim()) {
  newErrors.title = "Task title is required.";
} else if (title.trim().length < 3) {
  newErrors.title = "Title must be at least 3 characters.";
} else if (title.trim().length > 50) {
  newErrors.title = "Title cannot exceed 50 characters.";
}

    if (description.trim().length > 300) {
      newErrors.description =
        "Description cannot exceed 300 characters.";
    }

    if (!dueDate) {
      newErrors.dueDate = "Please select a due date.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          description,
          dueDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onTaskAdded(res.data);

      setTitle("");
      setDescription("");
      setDueDate("");
      setErrors({});
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setErrors({});
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white border-2 border-gray-200 overflow-hidden"
      >
        {/* Title */}
        <div className="p-4 border-b border-gray-100">
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-lg font-semibold text-gray-800 placeholder-gray-400 focus:outline-none"
          />

          {errors.title && (
            <p className="text-red-500 text-sm mt-2">
              {errors.title}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="p-4 bg-gray-50">
          <textarea
            placeholder="Add description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full p-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />

          <div className="flex justify-between mt-2">
            {errors.description ? (
              <p className="text-red-500 text-sm">
                {errors.description}
              </p>
            ) : (
              <span></span>
            )}

            <p
              className={`text-xs ${
                description.length > 300
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {description.length}/300
            </p>
          </div>
        </div>

        {/* Due Date */}
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Due Date
          </label>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {errors.dueDate && (
            <p className="text-red-500 text-sm mt-2">
              {errors.dueDate}
            </p>
          )}
        </div>

        {/* Buttons */}
        <div className="p-4 flex justify-between items-center border-t">
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700"
          >
            <X size={18} />
            Cancel
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
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