import axios from "axios";
import createError from "http-errors";
import { mlConfig } from "../config/ml.js";
import { ISSUE_TYPES } from "../utils/constants.js";

const defaultFallback = {
  issueType: ISSUE_TYPES[0],
  severity: 50,
};

export const analyzeImage = async (imageUrl) => {
  if (!mlConfig.baseURL) {
    return defaultFallback;
  }

  try {
    const { data } = await axios.post(
      `${mlConfig.baseURL}/analyze`,
      { imageUrl },
      {
        timeout: mlConfig.timeout,
        headers: mlConfig.apiKey
          ? { "x-api-key": mlConfig.apiKey }
          : undefined,
      }
    );

    const issueType = ISSUE_TYPES.includes(data.issueType)
      ? data.issueType
      : defaultFallback.issueType;

    const severity = typeof data.severity === "number" ? data.severity : defaultFallback.severity;

    return { issueType, severity };
  } catch (error) {
    console.error("ML inference failed", error.message);
    throw createError(502, "ML inference failed");
  }
};
