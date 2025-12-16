import { type Request, type Response } from "express";
import { Designation } from "../models/designation.model.ts";

import { ApiResponse } from "../utils/ApiResponse.ts";
import asyncHandler from "../utils/asyncHandler.ts";

const getAllDesignations = asyncHandler(async (req: Request, res: Response) => {
  const designations = await Designation.find();
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
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json(new ApiResponse(400, null, "Name is required"));
  }
  const designation = new Designation({
    title,
    description,
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
