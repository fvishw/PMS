import { performanceStatus } from "@/controllers/cards.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get(
  "/performance-status",
  authMiddleware(["manager", "admin", "employee"]),
  performanceStatus,
);

export default router;
