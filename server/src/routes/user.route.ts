import { Router } from "express";
import { addUser } from "../controllers/user.controller.ts";
import authMiddleware from "../middlewares/auth.middleware.ts";

const userRouter = Router();

userRouter.post("/add", authMiddleware(["admin"]), addUser);

export default userRouter;
