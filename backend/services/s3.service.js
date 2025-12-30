import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import createError from "http-errors";
import s3Client, { S3_BUCKET, S3_REGION } from "../config/s3.js";

export const uploadImageToS3 = async (file) => {
  if (!file) {
    throw createError(400, "Image file is required");
  }

  if (!S3_BUCKET) {
    throw createError(500, "S3 bucket is not configured");
  }

  const extension = file.originalname?.split(".").pop() || "jpg";
  const key = `reports/${uuidv4()}.${extension}`;

  try {
    const command = new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    });

    await s3Client.send(command);

    const url = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    throw createError(500, `Failed to upload image: ${error.message}`);
  }
};
