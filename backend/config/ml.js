export const mlConfig = {
  baseURL: process.env.ML_API_URL || "",
  apiKey: process.env.ML_API_KEY || "",
  timeout: Number(process.env.ML_API_TIMEOUT || 7000),
};
