import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  login,
  logout,
  refreshAccessToken,
  signUp,
} from "../controllers/userAuth.controller.ts";

const userAuth = Router();

userAuth.post("/signup", signUp);

userAuth.post("/login", login);

userAuth.put("/logout", authMiddleware(["admin", "user", "manager"]), logout);

userAuth.post("/refresh-token", refreshAccessToken);

export default userAuth;
