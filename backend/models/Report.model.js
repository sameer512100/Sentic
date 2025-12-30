import mongoose from "mongoose";
import { ISSUE_TYPES, STATUS } from "../utils/constants.js";

const locationSchema = new mongoose.Schema(
  {
    area: { type: String, trim: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { _id: false }
);

const reporterSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    imageData: { type: String, required: true },
    imageMimeType: { type: String, default: "image/jpeg" },
    issueType: { type: String, enum: ISSUE_TYPES, required: true },
    severity: { type: Number, min: 0, max: 100, required: true },
    location: locationSchema,
    reporter: reporterSchema,
    status: { type: String, enum: STATUS, default: "open" },
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);

export default mongoose.model("Report", reportSchema);
