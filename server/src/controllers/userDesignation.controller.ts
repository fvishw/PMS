import { type Request, type Response } from "express";
import { Designation } from "@/models/designation.model.js";

import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";

const getAllDesignations = asyncHandler(async (req: Request, res: Response) => {
  const { role } = req.query;

  const designationQuery: Record<string, string> = {};
  if (role) {
    designationQuery["role"] = role as string;
  }

  const designations = await Designation.find(designationQuery);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { designations },
        "Designations fetched successfully"
      )
    );
});

const addDesignation = asyncHandler(async (req: Request, res: Response) => {
  const { title, role } = req.body;
  if (!title || ["employee", "manager", "admin"].includes(role) === false) {
    return res.status(400).json(new ApiResponse(400, null, "Name is required"));
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

const deleteDesignation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const designation = await Designation.findByIdAndDelete(id);
  if (!designation) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Designation not found"));
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, designation, "Designation deleted successfully")
    );
});

export { getAllDesignations, addDesignation, deleteDesignation };
