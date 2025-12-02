import { Router } from "express";
import {
  addDesignation,
  deleteDesignation,
  getAllDesignations,
} from "../controllers/userDesignation.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/add", authMiddleware(["admin", "manager"]), addDesignation);
router.delete(
  "/delete/:id",
  authMiddleware(["admin", "manager"]),
  deleteDesignation
);
router.get("/all", authMiddleware(["admin", "manager"]), getAllDesignations);

export default router;
