import { Router } from "express";
import { addCheckIns, addCheckInsQuestions } from "../controllers/checkIns.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/add", authMiddleware(["employee"]), addCheckIns);
router.post("/add-questions", authMiddleware(["admin"]), addCheckInsQuestions);

export default router;
