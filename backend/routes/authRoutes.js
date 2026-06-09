import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Task from "../models/Task.js";
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Register route
router.post('/', registerUser);
// Login route
router.post('/login', loginUser);

// tasks route (protected)
router.get("/tasks", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Malformed token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch tasks from DB
    const tasks = await Task.find({ userId: decoded.userId });

    res.json(tasks);
      } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});
const authRoutes = router;
export default authRoutes;