import createError from "http-errors";

export const encodeImageToBase64 = (file) => {
  if (!file) {
    throw createError(400, "Image file is required");
  }

  const base64 = file.buffer.toString("base64");
  return base64;
};

export const getImageDataUrl = (base64Data, mimeType = "image/jpeg") => {
  return `data:${mimeType};base64,${base64Data}`;
};
