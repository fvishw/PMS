import { Router } from "express";
import { addUser } from "../controllers/user.controller.ts";

const userRouter = Router();

// Example route handlers
// userRouter.get("/");

userRouter.post("/add", addUser);

// userRouter.get("/:id");

// userRouter.put("/:id");

// userRouter.delete("/:id");

export default userRouter;
