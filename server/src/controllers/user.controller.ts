import { type Request, type Response } from "express";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { UserPerformance } from "../models/performance.model.ts";
import { userAddPayloadSchema } from "../types/user.ts";

const addUser = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = userAddPayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid request payload");
  }

  const {
    fullName,
    email,
    role,
    designationId,
    parentReviewerId,
    adminReviewerId,
  } = parsedPayload.data;

  const user = new User({
    fullName,
    email,
    role,
    designation: designationId,
    parentReviewer: parentReviewerId,
    adminReviewer: adminReviewerId,
  });
  await user.save();

  const newUser = await User.findById(user._id)
    .populate("designation")
    .select("-password -refreshToken -passwordResetToken");

  //send email to user to complete signup process
  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User added successfully"));
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({
    role: { $ne: "admin" },
  })
    .select("-password -refreshToken -passwordResetToken")
    .populate({ path: "designation", select: "title" })
    .populate({ path: "parentReviewer", select: "fullName" });

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

const getAllManagers = asyncHandler(async (req: Request, res: Response) => {
  const managers = await User.find({ role: "manager" }).select(
    "-password -refreshToken -passwordResetToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, managers, "Managers fetched successfully"));
});

const fetchUsersByRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.query;

  if (!role) {
    throw new ApiError(400, "Role query parameter is required");
  }

  const users = await User.find({ role })
    .select("-password -refreshToken -passwordResetToken -email")
    .populate({ path: "designation", select: "title" });

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

export { addUser, getAllUsers, getAllManagers, fetchUsersByRole };
