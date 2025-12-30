import jwt from "jsonwebtoken";
import createError from "http-errors";

export const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return next(createError(401, "Unauthorized"));
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
    req.adminId = decoded.id;
    return next();
  } catch (err) {
    return next(createError(401, "Invalid or expired token"));
  }
};
