import {
  generateUserReport,
  getCurrentQuarterReport,
  getCurrentQuarterReportStatus,
  getReportById,
  getUserReports,
} from "@/controllers/report.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get(
  "/user-past-reports",
  authMiddleware(["employee", "manager", "admin"]),
  getUserReports,
);

router.post(
  "/generate-user-report",
  authMiddleware(["employee", "manager", "admin"]),
  generateUserReport,
);

router.get(
  "/current-quarter-status",
  authMiddleware(["employee", "manager", "admin"]),
  getCurrentQuarterReportStatus,
);

router.get(
  "/current-quarter-report",
  authMiddleware(["employee", "manager", "admin"]),
  getCurrentQuarterReport,
);

router.get(
  "/by-id",
  authMiddleware(["employee", "manager", "admin"]),
  getReportById,
);

export default router;
