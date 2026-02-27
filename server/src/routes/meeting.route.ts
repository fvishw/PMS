import {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getAllMeetings,
  getMeetingById,
} from "@/controllers/meeting.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

router.post("/add", authMiddleware(["admin"]), createMeeting);

router.put("/update/:meetingId", authMiddleware(["admin"]), updateMeeting);

router.delete("/delete", authMiddleware(["admin"]), deleteMeeting);

router.get("/get-all", authMiddleware(["admin"]), getAllMeetings);

router.get("/get/:meetingId", authMiddleware(["admin"]), getMeetingById);

export default router;
