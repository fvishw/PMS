import { type Request, type Response } from "express";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userAddPayloadSchema, userUpdatePayloadSchema } from "../types/user.js";
import emailService from "../services/emailService/email.service.js";
import { Types } from "mongoose";
import { getPaginationMeta, getPaginationParams } from "../utils/pagination.js";

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const findUserByEmail = (email: string, excludeUserId?: string) => {
  const filter: Record<string, unknown> = {
    email: { $regex: `^${escapeRegex(email.trim())}$`, $options: "i" },
  };

  if (excludeUserId) {
    filter._id = { $ne: new Types.ObjectId(excludeUserId) };
  }

  return User.findOne(filter).select("_id");
};

const findUserByPhoneNumber = (phoneNumber: string, excludeUserId?: string) => {
  const filter: Record<string, unknown> = {
    phoneNumber: phoneNumber.trim(),
  };

  if (excludeUserId) {
    filter._id = { $ne: new Types.ObjectId(excludeUserId) };
  }

  return User.findOne(filter).select("_id");
};

const addUser = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = userAddPayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid request payload");
  }

  const {
    fullName,
    email,
    phoneNumber,
    joiningDate,
    role,
    designationId,
    parentReviewerId,
    adminReviewerId,
  } = parsedPayload.data;

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhoneNumber = phoneNumber.trim();

  const [existingEmailUser, existingPhoneUser] = await Promise.all([
    findUserByEmail(normalizedEmail),
    findUserByPhoneNumber(normalizedPhoneNumber),
  ]);

  if (existingEmailUser) {
    throw new ApiError(409, "This email address is already used by another user");
  }

  if (existingPhoneUser) {
    throw new ApiError(409, "This phone number is already used by another user");
  }

  const user = new User({
    fullName,
    email: normalizedEmail,
    phoneNumber: normalizedPhoneNumber,
    joiningDate: new Date(joiningDate),
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

const updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const actingAdminId = req.user?.id;
  const { isActive } = req.body as { isActive?: unknown };

  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id format.");
  }
  if (!actingAdminId || !Types.ObjectId.isValid(actingAdminId)) {
    throw new ApiError(401, "Unauthorized");
  }
  if (userId === actingAdminId) {
    throw new ApiError(400, "You cannot change your own account status");
  }
  if (typeof isActive !== "boolean") {
    throw new ApiError(400, "isActive must be provided as a boolean value");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }
  if (user.role === "admin") {
    throw new ApiError(
      400,
      "Admin account status cannot be changed from this screen",
    );
  }

  user.isActive = isActive;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            isActive: user.isActive,
          },
        },
        `User marked as ${isActive ? "active" : "inactive"} successfully`,
      ),
    );
});

const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const userFilter = {
    role: { $ne: "admin" },
  };

  const [users, totalItems] = await Promise.all([
    User.find(userFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .select("-password -refreshToken -passwordResetToken")
      .populate({ path: "designation", select: "title" })
      .populate({ path: "parentReviewer", select: "fullName" })
      .populate({ path: "adminReviewer", select: "fullName" }),
    User.countDocuments(userFilter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        users,
        pagination: getPaginationMeta({ totalItems, page, limit }),
      },
      "Users fetched successfully",
    ),
  );
});

const getAllManagers = asyncHandler(async (req: Request, res: Response) => {
  const managers = await User.find({
    role: "manager",
    isActive: { $ne: false },
  }).select("-password -refreshToken -passwordResetToken");

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

  const users = await User.find({
    role,
    isActive: { $ne: false },
  })
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

  const user = await User.findOne({
    _id: userId,
    isActive: { $ne: false },
  })
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
  if (!Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user id format.");
  }
  const parsedPayload = userUpdatePayloadSchema.safeParse({
    ...req.body,
  });
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid request payload");
  }

  const {
    fullName,
    phoneNumber,
    joiningDate,
    role,
    designationId,
    parentReviewerId,
    adminReviewerId,
  } = parsedPayload.data;

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

  const normalizedPhoneNumber = phoneNumber.trim();
  const existingPhoneUser = await findUserByPhoneNumber(
    normalizedPhoneNumber,
    userId,
  );

  if (existingPhoneUser) {
    throw new ApiError(409, "This phone number is already used by another user");
  }

  user.fullName = fullName;
  user.phoneNumber = normalizedPhoneNumber;
  user.joiningDate = new Date(joiningDate);
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
    .json(
      new ApiResponse(200, { user: updatedUser }, "User updated successfully"),
    );
});

export {
  addUser,
  getAllUsers,
  getAllManagers,
  fetchUsersByRole,
  getUserProfile,
  updateUser,
  updateUserStatus,
};
