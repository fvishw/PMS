import { Router } from "express";
import {
  addUser,
  fetchUsersByRole,
  getAllManagers,
  getAllUsers,
} from "../controllers/user.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  addDesignation,
  deleteDesignation,
  getAllDesignations,
} from "../controllers/userDesignation.controller.ts";

const userRouter = Router();

userRouter.post("/add", authMiddleware(["admin"]), addUser);

userRouter.get("/all-user", authMiddleware(["admin"]), getAllUsers);

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
