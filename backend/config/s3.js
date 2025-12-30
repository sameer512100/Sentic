import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION || "us-east-1";

const s3Client = new S3Client({
  region,
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

export const S3_BUCKET = process.env.S3_BUCKET;
export const S3_REGION = region;
export default s3Client;
