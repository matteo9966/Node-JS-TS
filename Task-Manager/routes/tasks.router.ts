import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../controllers/tasks";
const taskRouter = express.Router();

taskRouter.route("/").post(createTask).get(getAllTasks).patch(updateTask);
taskRouter.route("/:id").get(getTask).delete(deleteTask);
taskRouter.route("/update").patch(updateTask);

export { taskRouter };
