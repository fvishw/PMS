import { Router } from "express";
import {
  createPerformanceRecord,
  managerReviewKpi,
  selfReviewKpi,
  updateKpiStatus,
  userFinalReviewKpi,
  getUserKpiDetails,
  getAllPerformanceTemplates,
  adminReviewKpi,
  getUserPerformanceForm,
  getPerformanceTemplateById,
  getReviewAppraisalData,
} from "@/controllers/performance.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";

const router = Router();

// need to add admin auth middleware
router.post("/add", authMiddleware(["admin"]), createPerformanceRecord);

router.put("/accept-kpi", authMiddleware(["employee"]), updateKpiStatus);

router.put("/self-review", authMiddleware(["employee"]), selfReviewKpi);

router.put("/manager-review", authMiddleware(["manager"]), managerReviewKpi);

router.put("/admin-review", authMiddleware(["admin"]), adminReviewKpi);

router.put("/user-review", authMiddleware(["employee"]), userFinalReviewKpi);

router.get(
  "/user-kpi-details",
  authMiddleware(["employee"]),
  getUserKpiDetails
);

router.get(
  "/all-performance-templates",
  authMiddleware(["admin"]),
  getAllPerformanceTemplates
);

router.get(
  "/performance-form",
  authMiddleware(["employee"]),
  getUserPerformanceForm
);

router.get(
  "/performance-by-id",
  authMiddleware(["admin"]),
  getPerformanceTemplateById
);

router.get(
  "/review-appraisal-data",
  authMiddleware(["manager", "admin"]),
  getReviewAppraisalData
);

export default router;
