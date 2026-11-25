const AppError = require("../utils/app-error");

const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err instanceof AppError ? err.message : "Something went wrong",
  });
};

module.exports = errorHandler;
