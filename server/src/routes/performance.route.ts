import { Router } from "express";
import {
  createPerformanceRecord,
  appraiserReviewKpi,
  getAllUserKpiStatus,
  managerReviewKpi,
  reviewerReviewKpi,
  selfReviewKpi,
  updateKpiStatus,
  userFinalReviewKpi,
  getAllPerformance,
  getUserKpiDetails,
} from "../controllers/performance.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router = Router();

// need to add admin auth middleware
router.post("/add", authMiddleware(["admin"]), createPerformanceRecord);

router.put("/accept-kpi", authMiddleware(["employee"]), updateKpiStatus);

router.put("/self-review", authMiddleware(["employee"]), selfReviewKpi);

router.put("/manager-review", authMiddleware(["manager"]), managerReviewKpi);

router.put("/reviewer-review", authMiddleware(["admin"]), reviewerReviewKpi);

router.put("/appraiser-review", authMiddleware(["admin"]), appraiserReviewKpi);

router.put("/user-review", authMiddleware(["employee"]), userFinalReviewKpi);

router.get(
  "/all-user-kpi-status",
  authMiddleware(["admin"]),
  getAllUserKpiStatus
);
// for admin to view all performance records(not user specific)
router.get("/all-performance", authMiddleware(["admin"]), getAllPerformance);

router.get(
  "/user-kpi-details",
  authMiddleware(["employee"]),
  getUserKpiDetails
);

export default router;
