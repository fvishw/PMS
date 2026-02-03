import {
  dashBoardStats,
  goalCardStats,
  performanceStatus,
  reviewDashboardStats,
} from "@/controllers/cards.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get(
  "/performance-status",
  authMiddleware(["manager", "admin", "employee"]),
  performanceStatus,
);

router.get(
  "/dashboard-status",
  authMiddleware(["admin", "manager"]),
  dashBoardStats,
);

router.get(
  "/review-dashboard-status",
  authMiddleware(["admin", "manager"]),
  reviewDashboardStats,
);
router.get(
  "/goal-dashboard-status",
  authMiddleware(["admin", "manager"]),
  goalCardStats,
);
export default router;
