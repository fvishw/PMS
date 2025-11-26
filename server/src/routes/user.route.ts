import { Router } from "express";

const userRouter = Router();

// Example route handlers
userRouter.get("/");
// add user
userRouter.post("/");

userRouter.get("/:id");

userRouter.put("/:id");

userRouter.delete("/:id");

export default userRouter;
