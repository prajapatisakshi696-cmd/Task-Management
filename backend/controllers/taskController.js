import Task from "../models/Task.js";

 // Get all tasks for logged-in user
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      status,
    } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      status: status || "pending",
      userId: req.user.id,
    });

    await task.save();

    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      dueDate,
      status,
    } = req.body;

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      {
        title,
        description,
        dueDate,
        status,
      },
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Delete task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const patchTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user.id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};



