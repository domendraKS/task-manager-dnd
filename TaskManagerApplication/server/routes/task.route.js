import express from "express";
import verifyUser from "../middleware/verifyUser.js";
import {
  createTask,
  deleteTask,
  getAllTask,
  getOneTask,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controlle.js";

const taskRoute = express.Router();

taskRoute.post("/create", verifyUser, createTask);
taskRoute.get("/getAll", verifyUser, getAllTask);
taskRoute.get("/getOne/:taskId", verifyUser, getOneTask);
taskRoute.delete("/delete/:taskId", verifyUser, deleteTask);
taskRoute.put("/update/:taskId", verifyUser, updateTask);
taskRoute.patch("/update/:taskId", verifyUser, updateTaskStatus);

export default taskRoute;
