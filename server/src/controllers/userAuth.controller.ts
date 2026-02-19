import type { Request, Response } from "express";
import asyncHandler from "@/utils/asyncHandler.js";
import { ApiError } from "@/utils/ApiError.js";
import { User } from "@/models/user.model.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import AuthService from "@/utils/AuthService.js";
import EmailService from "@/services/emailService/email.service.js";

const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const existingUser = await User.findOne({
    email,
    isSignUpComplete: false,
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
  const user = await User.findOne({ email: email, isSignUpComplete: true });

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
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
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

export {
  signUp,
  login,
  logout,
  sendResetLink,
  verifyPasswordResetLink,
  resetPassword,
};
