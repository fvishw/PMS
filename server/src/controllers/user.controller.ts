import { type Request, type Response } from "express";
import { User } from "@/models/user.model.js";
import { ApiError } from "@/utils/ApiError.js";
import asyncHandler from "@/utils/asyncHandler.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import { userAddPayloadSchema } from "@/types/user.js";
import emailService from "@/services/emailService/email.service.js";

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
    .populate({ path: "parentReviewer", select: "fullName" });

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

export { addUser, getAllUsers, getAllManagers, fetchUsersByRole };
