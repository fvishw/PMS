import { type Request, type Response } from "express";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";

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

export { addUser };
