import { Router } from "express";
import {
  addUser,
  getAllManagers,
  getAllUsers,
} from "../controllers/user.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const userRouter = Router();

userRouter.post("/add", authMiddleware(["admin"]), addUser);

userRouter.get("/all-user", authMiddleware(["admin"]), getAllUsers);

userRouter.get("/all-managers", authMiddleware(["admin"]), getAllManagers);

export default userRouter;
