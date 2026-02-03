import {
  getCurrentSettings,
  updateSettings,
} from "@/controllers/settings.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.get("/", authMiddleware(["admin"]), getCurrentSettings);

router.put("/", authMiddleware(["admin"]), updateSettings);

export default router;
