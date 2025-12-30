import { Router } from "express";
import { upload } from "../middlewares/upload.middleware.js";
import {
  createReport,
  getPublicReportsController,
  getSinglePublicReport,
} from "../controllers/report.controller.js";

const router = Router();

router.post("/", upload.single("image"), createReport);
router.get("/", getPublicReportsController);
router.get("/:id", getSinglePublicReport);

export default router;
