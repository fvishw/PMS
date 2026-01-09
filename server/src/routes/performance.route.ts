import { Router } from "express";
import {
  createPerformanceRecord,
  managerReviewKpi,
  selfReviewKpi,
  updateKpiStatus,
  userFinalReview,
  getUserKpiDetails,
  getAllPerformanceTemplates,
  adminReview,
  getUserPerformanceForm,
  getPerformanceTemplateById,
  getReviewAppraisalData,
  getUserPerformanceFormById,
  getManagerReviewAppraisalData,
} from "@/controllers/performance.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";

const router = Router();

// need to add admin auth middleware
router.post("/add", authMiddleware(["admin"]), createPerformanceRecord);

router.put("/accept-kpi", authMiddleware(["employee"]), updateKpiStatus);

router.put("/self-review", authMiddleware(["employee"]), selfReviewKpi);

router.put("/manager-review", authMiddleware(["manager"]), managerReviewKpi);

router.put("/admin-review", authMiddleware(["admin"]), adminReview);

router.put("/user-final-review", authMiddleware(["employee"]), userFinalReview);

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
//for employee to get their performance form
router.get(
  "/performance-form",
  authMiddleware(["employee"]),
  getUserPerformanceForm
);

//for admin to get performance template by id
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

router.get(
  "/manager-review-appraisal-data",
  authMiddleware(["manager"]),
  getManagerReviewAppraisalData
);

// for employee/manager/admin to get user performance form by performanceId
router.get(
  "/user-performance/by-id",
  authMiddleware(["employee", "manager", "admin"]),
  getUserPerformanceFormById
);

export default router;
