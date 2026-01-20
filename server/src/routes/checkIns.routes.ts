import { Router } from "express";
import {
  addCheckIns,
  addCheckInQuestions,
  getCheckIns,
  getPastCheckIns,
  getAllUserCheckIns,
  getUserCheckInById,
  getAllCheckInQuestionsByVersion,
  activateQuestionSet,
  getAllCheckInQuestions,
} from "@/controllers/checkIns.controller.js";

import authMiddleware from "@/middlewares/auth.middleware.js";

const router = Router();

router.post("/add", authMiddleware(["employee"]), addCheckIns);

//for admin only
router.post("/add-questions", authMiddleware(["admin"]), addCheckInQuestions);

router.get("/", authMiddleware(["employee", "manager", "admin"]), getCheckIns);

router.get(
  "/past-checkins",
  authMiddleware(["employee", "admin"]),
  getPastCheckIns,
);

router.get("/user-checkins", authMiddleware(["admin"]), getAllUserCheckIns);

router.get(
  "/user-past-checkins/:checkInId",
  authMiddleware(["admin"]),
  getUserCheckInById,
);

router.get(
  "/question-sets",
  authMiddleware(["employee", "admin"]),
  getAllCheckInQuestions,
);

router.put(
  "/set-active-question-set",
  authMiddleware(["admin"]),
  activateQuestionSet,
);

router.get(
  "/questions-by-version",
  authMiddleware(["admin"]),
  getAllCheckInQuestionsByVersion,
);

export default router;
