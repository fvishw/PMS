import { type Request, type Response } from "express";
import { User } from "@/models/user.model.js";
import { ApiError } from "@/utils/ApiError.js";
import asyncHandler from "@/utils/asyncHandler.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import { userAddPayloadSchema, userUpdatePayloadSchema } from "@/types/user.js";
import emailService from "@/services/emailService/email.service.js";
import { Types } from "mongoose";

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

  try {
    await emailService.sendInvitationEmail(user.email);
  } catch (error) {
    console.error("Error sending invitation email:", error);
  }
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
    .populate({ path: "parentReviewer", select: "fullName" })
    .populate({ path: "adminReviewer", select: "fullName" });

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

const getAllManagers = asyncHandler(async (req: Request, res: Response) => {
  const managers = await User.find({ role: "manager" }).select(
    "-password -refreshToken -passwordResetToken",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, managers, "Managers fetched successfully"));
});

const fetchUsersByRole = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.query;

  const allowedRoles = ["admin", "manager", "employee"];
  if (!role || !allowedRoles.includes(role as string)) {
    throw new ApiError(
      400,
      `Invalid role. Allowed values: ${allowedRoles.join(", ")}`,
    );
  }

  const users = await User.find({ role })
    .select("-password -refreshToken -passwordResetToken")
    .populate({ path: "designation", select: "title role" });

  return res
    .status(200)
    .json(new ApiResponse(200, { users }, "Users fetched successfully"));
});

const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const user = await User.findById(userId)
    .select("-password -refreshToken -passwordResetToken")
    .populate({ path: "designation", select: "title role" })
    .populate({ path: "parentReviewer", select: "fullName email" })
    .populate({ path: "adminReviewer", select: "fullName email" });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "User profile fetched successfully"));
});

const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const parsedPayload = userUpdatePayloadSchema.safeParse({
    ...req.body,
  });
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid request payload");
  }

  const { fullName, role, designationId, parentReviewerId, adminReviewerId } =
    parsedPayload.data;

  if (!Types.ObjectId.isValid(designationId)) {
    throw new ApiError(400, "Invalid designation id format.");
  }
  if (parentReviewerId && !Types.ObjectId.isValid(parentReviewerId)) {
    throw new ApiError(400, "Invalid parent reviewer id format.");
  }
  if (adminReviewerId && !Types.ObjectId.isValid(adminReviewerId)) {
    throw new ApiError(400, "Invalid admin reviewer id format.");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.fullName = fullName;
  user.role = role;
  user.designation = new Types.ObjectId(designationId);
  user.parentReviewer = parentReviewerId
    ? new Types.ObjectId(parentReviewerId)
    : user.parentReviewer;
  user.adminReviewer = adminReviewerId
    ? new Types.ObjectId(adminReviewerId)
    : user.adminReviewer;

  await user.save();

  const updatedUser = await User.findById(user._id)
    .select("-password -refreshToken -passwordResetToken")
    .populate({ path: "designation", select: "title" })
    .populate({ path: "parentReviewer", select: "fullName" })
    .populate({ path: "adminReviewer", select: "fullName" });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

export {
  addUser,
  getAllUsers,
  getAllManagers,
  fetchUsersByRole,
  getUserProfile,
  updateUser,
};
