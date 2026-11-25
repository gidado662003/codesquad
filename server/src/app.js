const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const errorHandler = require("./middleware/error.middleware");
const allRoutes = require("./api");

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Task API is running",
    endpoints: {
      signup: "POST /api/v1/auth/signup",
      login: "POST /api/v1/auth/login",
      me: "GET /api/v1/auth/me",
      tasks: "GET /api/v1/task  POST /api/v1/task",
      task: "GET /api/v1/task/:id  PUT /api/v1/task/:id  DELETE /api/v1/task/:id",
    },
  });
});

app.use("/api/v1", allRoutes);
app.use(errorHandler);
module.exports = app;
