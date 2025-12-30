import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  loginAdmin,
  getAllReportsAdminController,
  updateReportStatusController,
} from "../controllers/admin.controller.js";

const router = Router();

router.post("/login", loginAdmin);
router.use(authMiddleware);
router.get("/reports", getAllReportsAdminController);
router.patch("/reports/:id/status", updateReportStatusController);

export default router;
