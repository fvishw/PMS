import { type Request, type Response } from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { User } from "../models/user.model.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";

const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  const existingUser = await User.findOne({
    email,
    isSignUpComplete: true,
  });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const adminUser = new User({
    email,
    password,
    role: "admin",
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

  const token = user.generateAuthToken();

  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "Login successful"));
});

export { signUp, login };
