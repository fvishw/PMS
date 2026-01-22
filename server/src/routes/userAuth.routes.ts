import { Router } from "express";
import authMiddleware from "@/middlewares/auth.middleware.js";
import {
  sendResetLink,
  login,
  logout,
  signUp,
  verifyPasswordResetLink,
  resetPassword,
} from "@/controllers/userAuth.controller.js";

const userAuth = Router();

userAuth.post("/signup", signUp);

userAuth.post("/login", login);

userAuth.put(
  "/logout",
  authMiddleware(["admin", "employee", "manager"]),
  logout,
);

userAuth.post("/send-reset-link", sendResetLink);

userAuth.post("/verify-password-reset-link", verifyPasswordResetLink);

userAuth.post("/reset-password", resetPassword);

export default userAuth;
