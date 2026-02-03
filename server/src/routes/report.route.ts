import {
  generateUserReport,
  getUserReports,
} from "@/controllers/report.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get(
  "/user-report",
  authMiddleware(["employee", "manager", "admin"]),
  getUserReports,
);

router.post(
  "/generate-user-report",
  authMiddleware(["employee", "manager", "admin"]),
  generateUserReport,
);

export default router;
