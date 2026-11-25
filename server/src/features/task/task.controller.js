const Task = require("../../models/task.model");
const AppError = require("../../utils/app-error");

function publicTask(task) {
  return {
    id: task._id.toString(),
    userId: task.userId.toString(),
    title: task.title,
    description: task.description,
    status: task.status,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
  };
}

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id }).sort({
    createdAt: -1,
  });
  res.json({ success: true, response: tasks.map(publicTask) });
};

exports.getTask = async (req, res) => {
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!task) throw new AppError("Task not found", 404);
  res.json({ success: true, response: publicTask(task) });
};

exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  if (!title) throw new AppError("Title is required", 400);

  const task = await Task.create({
    userId: req.user.id,
    title,
    description: description || "",
    status: status || "todo",
  });
  res.status(201).json({ success: true, response: publicTask(task) });
};

exports.updateTask = async (req, res) => {
  const { title, description, status } = req.body;
  const task = await Task.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!task) throw new AppError("Task not found", 404);

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  await task.save();
  res.json({ success: true, response: publicTask(task) });
};

exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });
  if (!task) throw new AppError("Task not found", 404);
  res.json({ success: true, response: publicTask(task) });
};
