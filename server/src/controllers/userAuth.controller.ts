import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { User } from "../models/user.model.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import AuthService from "../utils/AuthService.ts";

const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const existingUser = await User.findOne({
    email,
    isSignUpComplete: true,
  });

  if (!existingUser) {
    throw new ApiError(403, "Please contact Admin to create an account");
  }

  if (existingUser && existingUser.isSignUpComplete) {
    throw new ApiError(409, "User already exists");
  }

  const adminUser = new User({
    email,
    password,
    isSignUpComplete: true,
  });

  const user = await adminUser.save();

  if (!user) {
    throw new ApiError(400, "Please Contact Admin to create an account");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { email: user.email, role: user.role },
        "User registered successfully"
      )
    );
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email, isSignUpComplete: true });

  if (!user || !user.comparePassword(password)) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { accessToken, refreshToken }, "Login successful")
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

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token is required");
  }
  const decodedToken = AuthService.verifyRefreshToken(refreshToken);
  if (
    typeof decodedToken === "string" ||
    decodedToken.tokenType !== "refresh"
  ) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const user = await User.findById(decodedToken.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const newAccessToken = user.generateAuthToken();

  return res
    .status(200)
    .json(
      new ApiResponse(200, { accessToken: newAccessToken }, "Token refreshed")
    );
});

const sendResetLink = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const resetToken = AuthService.generatePasswordResetToken(
    user._id,
    user.email
  );
  user.passwordResetToken = resetToken;
  await user.save();

  // need to send reset link to user's email address

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Password Reset link sent to registered email address"
      )
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
    user.postPasswordResetCleanup();
    await user.save();

    return res.status(200).json(new ApiResponse(200, null, "OTP verified"));
  }
);

export {
  signUp,
  login,
  logout,
  refreshAccessToken,
  sendResetLink,
  verifyPasswordResetLink,
};
