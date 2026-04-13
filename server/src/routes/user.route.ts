import { Router } from "express";
import {
  addUser,
  fetchUsersByRole,
  getAllManagers,
  getAllUsers,
  getUserProfile,
  updateUser,
  updateUserStatus,
} from "@/controllers/user.controller.js";
import authMiddleware from "@/middlewares/auth.middleware.js";
import {
  addDesignation,
  deleteDesignation,
  getAllDesignations,
} from "@/controllers/userDesignation.controller.js";

const userRouter = Router();

userRouter.post("/add", authMiddleware(["admin"]), addUser);
userRouter.put("/update/:userId", authMiddleware(["admin"]), updateUser);
userRouter.patch(
  "/status/:userId",
  authMiddleware(["admin"]),
  updateUserStatus,
);

userRouter.get("/all-user", authMiddleware(["admin"]), getAllUsers);
userRouter.get(
  "/profile",
  authMiddleware(["admin", "manager", "employee"]),
  getUserProfile,
);

userRouter.get("/all-managers", authMiddleware(["admin"]), getAllManagers);

userRouter.get("/users-by-role", authMiddleware(["admin"]), fetchUsersByRole);

userRouter.post("/add-designation", authMiddleware(["admin"]), addDesignation);
userRouter.delete(
  "/delete-designation/:id",
  authMiddleware(["admin"]),
  deleteDesignation
);
userRouter.get(
  "/all-designations",
  authMiddleware(["admin"]),
  getAllDesignations
);

export default userRouter;
