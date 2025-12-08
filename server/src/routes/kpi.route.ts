import { Router } from "express";
import {
  addKpi,
  appraiserReviewKpi,
  managerReviewKpi,
  reviewerReviewKpi,
  selfReviewKpi,
  updateKpiStatus,
  userFinalReviewKpi,
} from "../controllers/kpi.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router = Router();

// need to add admin auth middleware
router.post("/add-master-kpi", authMiddleware(["admin"]), addKpi);

router.put("/accept-kpi", authMiddleware(["user"]), updateKpiStatus);

router.put("/self-review", authMiddleware(["user"]), selfReviewKpi);

router.put("/manager-review", authMiddleware(["manager"]), managerReviewKpi);

router.put("/reviewer-review", authMiddleware(["admin"]), reviewerReviewKpi);

router.put("/appraiser-review", authMiddleware(["admin"]), appraiserReviewKpi);

router.put("/user-review", authMiddleware(["user"]), userFinalReviewKpi);
export default router;
