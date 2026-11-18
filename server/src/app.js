const allRoutes = require("./api");
const express = require("express");
const morgan = require("morgan");
const app = express();
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1/", allRoutes);

module.exports = app;
