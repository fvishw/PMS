import { type Request, type Response } from "express";
import { Designation } from "@/models/designation.model.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import { Types } from "mongoose";

const getAllDesignations = asyncHandler(async (req: Request, res: Response) => {
  const { role, includeInactive } = req.query;
  const designationQuery: Record<string, unknown> = {};
  if (role) {
    designationQuery["role"] = role as string;
  }
  if (includeInactive !== "true") {
    designationQuery["isActive"] = { $ne: true };
  }

  const designations = await Designation.find(designationQuery).sort({
    role: 1,
    title: 1,
  });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { designations },
        "Designations fetched successfully",
      ),
    );
});

const addDesignation = asyncHandler(async (req: Request, res: Response) => {
  const title = req.body.title?.trim();
  const { role } = req.body;

  if (!title || ["employee", "manager", "admin"].includes(role) === false) {
    throw new ApiError(400, "Title and valid role are required");
  }

  const existingDesignation = await Designation.findOne({
    title: { $regex: `^${title}$`, $options: "i" },
    role,
  });

  if (existingDesignation && existingDesignation.isActive) {
    throw new ApiError(409, "Designation already exists for this role");
  }

  if (existingDesignation && existingDesignation.isActive === false) {
    existingDesignation.title = title;
    existingDesignation.role = role;
    existingDesignation.isActive = true;
    await existingDesignation.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          existingDesignation,
          "Designation reactivated successfully",
        ),
      );
  }

  const designation = new Designation({
    title,
    role,
  });
  await designation.save();
  res
    .status(201)
    .json(new ApiResponse(201, designation, "Designation added successfully"));
});

const updateDesignation = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  const title = req.body.title?.trim();
  const { role } = req.body;

  if (!id || !Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid designation id");
  }

  if (!title || ["employee", "manager", "admin"].includes(role) === false) {
    throw new ApiError(400, "Title and valid role are required");
  }

  const designation = await Designation.findById(id);
  if (!designation) {
    throw new ApiError(404, "Designation not found");
  }

  const duplicateDesignation = await Designation.findOne({
    _id: { $ne: id },
    title: { $regex: `^${title}$`, $options: "i" },
    role,
    isActive: true,
  });

  if (duplicateDesignation) {
    throw new ApiError(409, "Designation already exists for this role");
  }

  designation.title = title;
  designation.role = role;
  await designation.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, designation, "Designation updated successfully"),
    );
});

const updateDesignationStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const { isActive } = req.body;

    if (!id || !Types.ObjectId.isValid(id)) {
      throw new ApiError(400, "Invalid designation id");
    }

    if (typeof isActive !== "boolean") {
      throw new ApiError(400, "isActive must be a boolean");
    }

    const designation = await Designation.findById(id);
    if (!designation) {
      throw new ApiError(404, "Designation not found");
    }

    designation.isActive = isActive;
    await designation.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          designation,
          `Designation marked as ${isActive ? "active" : "inactive"} successfully`,
        ),
      );
  },
);

export {
  getAllDesignations,
  addDesignation,
  updateDesignation,
  updateDesignationStatus,
};
