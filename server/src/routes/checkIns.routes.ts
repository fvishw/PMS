import { Router } from "express";
import {
  addCheckIns,
  addCheckInsQuestions,
  getCheckIns,
  getPastCheckIns,
} from "../controllers/checkIns.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/add", authMiddleware(["employee"]), addCheckIns);

router.post("/add-questions", authMiddleware(["admin"]), addCheckInsQuestions);

router.get("/", authMiddleware(["employee", "admin"]), getCheckIns);

router.get(
  "/past-checkins",
  authMiddleware(["employee", "admin"]),
  getPastCheckIns
);

export default router;
