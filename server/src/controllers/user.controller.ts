import { type Request, type Response } from "express";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { MasterKpi } from "../models/masterKpi.model.ts";

const addUser = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, role, designationId } = req.body;

  if (!fullName || !email || !role || !designationId) {
    throw new ApiError(400, "All fields are required");
  }
  const user = new User({
    fullName,
    email,
    role,
    designation: designationId,
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

const getUserKpis = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const user = await User.findById(userId);

  const designationId = user?.designation;
  if (!designationId) {
    throw new ApiError(404, "Designation not found for the user");
  }

  const masterKpis = await MasterKpi.findOne({ designation: designationId });

  if (!masterKpis) {
    throw new ApiError(404, "No KPIs found for the user's designation");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { criteria: masterKpis.criteria },
        "User KPIs fetched successfully"
      )
    );
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

export { addUser, getUserKpis, getAllUsers, getAllManagers };
