const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 4000;
const SECRET = "classroom-secret-not-for-production";

// Allow the Next.js client (often 3000, sometimes 3001) to call this API
app.use(cors());
app.use(express.json());

// In-memory data so students can restart and start fresh
const users = [];
const tasks = [];
let nextUserId = 1;
let nextTaskId = 1;

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Please log in first" });
  }
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

app.get("/", (req, res) => {
  res.json({
    message: "Task API is running",
    endpoints: {
      signup: "POST /signup",
      login: "POST /login",
      me: "GET /me",
      tasks: "GET /tasks  POST /tasks",
      task: "GET /tasks/:id  PUT /tasks/:id  DELETE /tasks/:id",
    },
  });
});

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }
  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "That email is already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: nextUserId++, name, email, passwordHash };
  users.push(user);
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET,
  );
  res
    .status(201)
    .json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ error: "Wrong email or password" });
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    SECRET,
  );
  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.get("/me", auth, (req, res) => {
  res.json({
    user: { id: req.user.id, name: req.user.name, email: req.user.email },
  });
});

app.get("/tasks", auth, (req, res) => {
  res.json(tasks.filter((t) => t.userId === req.user.id));
});

app.get("/tasks/:id", auth, (req, res) => {
  const task = tasks.find(
    (t) => t.id === Number(req.params.id) && t.userId === req.user.id,
  );
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

app.post("/tasks", auth, (req, res) => {
  const { title, description, status } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const task = {
    id: nextTaskId++,
    userId: req.user.id,
    title,
    description: description || "",
    status: status || "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(task);
  res.status(201).json(task);
});

app.put("/tasks/:id", auth, (req, res) => {
  const task = tasks.find(
    (t) => t.id === Number(req.params.id) && t.userId === req.user.id,
  );
  if (!task) return res.status(404).json({ error: "Task not found" });
  const { title, description, status } = req.body;
  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined) task.status = status;
  task.updatedAt = new Date().toISOString();
  res.json(task);
});

app.delete("/tasks/:id", auth, (req, res) => {
  const index = tasks.findIndex(
    (t) => t.id === Number(req.params.id) && t.userId === req.user.id,
  );
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  const [removed] = tasks.splice(index, 1);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
