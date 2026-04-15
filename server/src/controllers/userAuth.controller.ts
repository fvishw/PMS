import type { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import AuthService from "../utils/AuthService.js";
import EmailService from "../services/emailService/email.service.js";
import z from "zod";

const changePasswordPayloadSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
});

const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const existingUser = await User.findOne({
    email,
    isSignUpComplete: false,
    isActive: { $ne: false },
  });

  if (!existingUser) {
    throw new ApiError(403, "Please contact Admin to create an account");
  }

  if (existingUser && existingUser.isSignUpComplete) {
    throw new ApiError(409, "User already exists");
  }

  existingUser.password = password;
  existingUser.isSignUpComplete = true;

  const user = await existingUser.save();

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: user.email, role: user.role },
        "User registered successfully",
      ),
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const user = await User.findOne({
    email: email,
    isSignUpComplete: true,
    isActive: { $ne: false },
  });

  if (!user || !user.comparePassword(password)) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAuthToken();
  await user.save();

  const savedUser = await User.findById(user._id)
    .select("-password -refreshToken -passwordResetToken")
    .populate("designation");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, user: savedUser },
        "Login successful",
      ),
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  // Invalidate the token on the client side by instructing the client to delete it.
  const userId = req.user?.id;
  const user = await User.findById(userId);
  if (user) {
    user.refreshToken = "";
    await user.save();
  }

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

const sendResetLink = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({
    email,
    isActive: { $ne: false },
  });
  if (!user) {
    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "Email sent with password reset instructions if an account exists with this email",
        ),
      );
  }
  const resetToken = AuthService.generatePasswordResetToken(
    user._id,
    user.email,
  );
  user.passwordResetToken = resetToken;
  await user.save();
  await EmailService.sendPasswordResetEmail(user.email, resetToken);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Email sent with password reset instructions if an account exists with this email",
      ),
    );
});

const verifyPasswordResetLink = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.body;
    if (!token) {
      throw new ApiError(400, "Token is required");
    }
    const decodedToken = AuthService.verifyPasswordResetToken(token);
    if (
      typeof decodedToken === "string" ||
      decodedToken.tokenType !== "reset"
    ) {
      throw new ApiError(401, "Invalid password reset token");
    }
    const user = await User.findById(decodedToken.id);
    if (!user || user.passwordResetToken !== token) {
      throw new ApiError(401, "Invalid password reset token");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Password reset token is valid"));
  },
);

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }
  const decodedToken = AuthService.verifyPasswordResetToken(token);
  if (typeof decodedToken === "string" || decodedToken.tokenType !== "reset") {
    throw new ApiError(401, "Invalid password reset token");
  }
  const user = await User.findById(decodedToken.id);

  if (!user || user.passwordResetToken !== token) {
    throw new ApiError(401, "Invalid password reset token");
  }

  user.password = newPassword;
  user.postPasswordResetCleanup();
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successful"));
});

const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsedPayload = changePasswordPayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    const firstIssue = parsedPayload.error.issues[0];
    throw new ApiError(400, firstIssue?.message || "Invalid request payload");
  }

  const { oldPassword, newPassword } = parsedPayload.data;

  if (oldPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password",
    );
  }

  const user = await User.findOne({
    _id: userId,
    isActive: { $ne: false },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isSignUpComplete || !user.password) {
    throw new ApiError(400, "Password has not been set for this account");
  }

  if (!user.comparePassword(oldPassword)) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  user.postPasswordResetCleanup();
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password changed successfully"));
});

export {
  signUp,
  login,
  logout,
  sendResetLink,
  verifyPasswordResetLink,
  resetPassword,
  changePassword,
};
