import createError from "http-errors";

export const notFound = (req, res, next) => {
  next(createError(404, "Route not found"));
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProduction = process.env.NODE_ENV === "production";
  const message = status >= 500 && isProduction ? "Internal Server Error" : err.message;

  if (!isProduction) {
    console.error(err);
  }

  res.status(status).json({
    success: false,
    message,
    details: isProduction ? undefined : err.stack,
  });
};
