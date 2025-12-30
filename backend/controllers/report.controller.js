import createError from "http-errors";
import { successResponse } from "../utils/response.js";
import {
  createReportPipeline,
  getPublicReports,
  getReportById,
} from "../services/report.service.js";

const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export const createReport = asyncHandler(async (req, res) => {
  const { area, latitude, longitude, name, phone } = req.body;

  const report = await createReportPipeline({
    file: req.file,
    payload: { area, latitude, longitude, name, phone },
  });

  return successResponse(res, report, "Report created", 201);
});

export const getPublicReportsController = asyncHandler(async (req, res) => {
  const reports = await getPublicReports();
  return successResponse(res, reports, "Reports fetched");
});

export const getSinglePublicReport = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw createError(400, "Report id is required");
  }

  const report = await getReportById(id, false);
  return successResponse(res, report, "Report fetched");
});
