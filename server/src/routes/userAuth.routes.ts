import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  forgetPassword,
  login,
  logout,
  refreshAccessToken,
  signUp,
  verifyOtp,
} from "../controllers/userAuth.controller.ts";

const userAuth = Router();

userAuth.post("/signup", signUp);

userAuth.post("/login", login);

userAuth.put("/logout", authMiddleware(["admin", "user", "manager"]), logout);

userAuth.post("/refresh-token", refreshAccessToken);

userAuth.post("/forget-password", forgetPassword);

userAuth.post("/verify-otp", verifyOtp);

export default userAuth;
