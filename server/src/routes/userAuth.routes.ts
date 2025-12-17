import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.ts";
import {
  sendResetLink,
  login,
  logout,
  refreshAccessToken,
  signUp,
  verifyPasswordResetLink,
  resetPassword,
} from "../controllers/userAuth.controller.ts";

const userAuth = Router();

userAuth.post("/signup", signUp);

userAuth.post("/login", login);

userAuth.put("/logout", authMiddleware(["admin", "employee", "manager"]), logout);

userAuth.post("/refresh-token", refreshAccessToken);

userAuth.post("/send-reset-link", sendResetLink);

userAuth.post("/verify-password-reset-link", verifyPasswordResetLink);

userAuth.post("/reset-password", resetPassword);

export default userAuth;
