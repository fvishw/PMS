import {
  addGoal,
  deleteGoal,
  getAllGoals,
  getGoalById,
  getGoalsByOwner,
  markAsComplete,
} from "@/controllers/goal.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";


const router = Router();

router.post("/add", authMiddleware(["admin", "employee", "manager"]), addGoal);

router.put(
  "/mark-as-complete",
  authMiddleware(["admin", "employee", "manager"]),
  markAsComplete
);

router.delete(
  "/delete",
  authMiddleware(["admin", "manager", "employee"]),
  deleteGoal
);

router.get("/get-all/admin", authMiddleware(["admin"]), getAllGoals);

router.get("/get-all/manager", authMiddleware(["manager"]));

router.get("/get-all/employee", authMiddleware(["employee"]), getAllGoals);

router.get(
  "/get/:goalId",
  authMiddleware(["admin", "employee", "manager"]),
  getGoalById
);

router.get(
  "/get-by-owner",
  authMiddleware(["employee", "manager"]),
  getGoalsByOwner
);

export default router;
