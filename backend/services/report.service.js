import createError from "http-errors";
import Report from "../models/Report.model.js";
import { encodeImageToBase64 } from "./image.service.js";
import { analyzeImage } from "./ml.service.js";
import { STATUS } from "../utils/constants.js";

export const createReportPipeline = async ({ file, payload }) => {
  if (!file) {
    throw createError(400, "Image is required");
  }

  const imageData = encodeImageToBase64(file);

  let mlResult;
  try {
    const base64DataUrl = `data:${file.mimetype};base64,${imageData}`;
    mlResult = await analyzeImage(base64DataUrl);
  } catch (err) {
    mlResult = { issueType: "pothole", severity: 50 };
  }

  const { area, latitude, longitude, name, phone } = payload;

  const report = await Report.create({
    imageData,
    imageMimeType: file.mimetype,
    issueType: mlResult.issueType,
    severity: mlResult.severity,
    location: {
      area,
      latitude: latitude ? Number(latitude) : undefined,
      longitude: longitude ? Number(longitude) : undefined,
    },
    reporter: { name, phone },
    status: "open",
  });

  return report;
};

export const getPublicReports = async () => {
  return Report.find()
    .select("imageMimeType issueType severity location status createdAt")
    .sort({ createdAt: -1 });
};

export const getReportById = async (id, includeReporter = false) => {
  const query = Report.findById(id);
  if (!includeReporter) {
    query.select("-reporter");
  }
  const report = await query;
  if (!report) {
    throw createError(404, "Report not found");
  }
  return report;
};

export const getAllReportsAdmin = async () => {
  return Report.find().sort({ createdAt: -1 });
};

export const updateReportStatus = async (id, status) => {
  if (!STATUS.includes(status)) {
    throw createError(400, "Invalid status value");
  }

  const report = await Report.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!report) {
    throw createError(404, "Report not found");
  }

  return report;
};
