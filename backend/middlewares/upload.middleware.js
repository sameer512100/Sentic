import multer from "multer";
import createError from "http-errors";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(createError(400, "Only JPG and PNG images are allowed"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});
