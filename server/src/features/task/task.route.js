const express = require("express");
const taskRoute = express.Router();
const taskController = require("./task.controller");
const { auth } = require("../../middleware/auth.middleware");

taskRoute.use(auth);
taskRoute.get("/", taskController.getTasks);
taskRoute.get("/:id", taskController.getTask);
taskRoute.post("/", taskController.createTask);
taskRoute.put("/:id", taskController.updateTask);
taskRoute.delete("/:id", taskController.deleteTask);

module.exports = taskRoute;
