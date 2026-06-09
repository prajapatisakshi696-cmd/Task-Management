import express from "express";
import { createTask, getTasks, updateTask, deleteTask, patchTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);
router.patch("/:id", authMiddleware, patchTask);

export default router;
