import { Router } from "express";
import {
  addDesignation,
  deleteDesignation,
  getAllDesignations,
} from "../controllers/userDesignation.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const router = Router();

router.post("/add", authMiddleware(["admin"]), addDesignation);
router.delete("/delete/:id", authMiddleware(["admin"]), deleteDesignation);
router.get("/all", authMiddleware(["admin"]), getAllDesignations);

export default router;
