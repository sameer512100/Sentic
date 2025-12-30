import jwt from "jsonwebtoken";
import createError from "http-errors";
import Admin from "../models/Admin.model.js";
import { successResponse } from "../utils/response.js";
import {
  getAllReportsAdmin,
  getReportById,
  updateReportStatus,
} from "../services/report.service.js";

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const signToken = (adminId) => {
  if (!process.env.ADMIN_JWT_SECRET) {
    throw new Error("ADMIN_JWT_SECRET is not configured");
  }
  return jwt.sign({ id: adminId }, process.env.ADMIN_JWT_SECRET, { expiresIn: "7d" });
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw createError(400, "Username and password are required");
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    throw createError(401, "Invalid credentials");
  }

  const isValid = await admin.comparePassword(password);
  if (!isValid) {
    throw createError(401, "Invalid credentials");
  }

  const token = signToken(admin._id);
  return successResponse(res, { token, admin: { id: admin._id, username: admin.username } }, "Login successful");
});

export const getAllReportsAdminController = asyncHandler(async (req, res) => {
  const reports = await getAllReportsAdmin();
  return successResponse(res, reports, "Reports fetched");
});

export const updateReportStatusController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw createError(400, "Status is required");
  }

  const report = await updateReportStatus(id, status);
  return successResponse(res, report, "Status updated");
});
