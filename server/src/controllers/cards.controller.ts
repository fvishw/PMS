import { UserPerformance } from "@/models/userPerformance.model.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";

const performanceStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id!;

  const userPerformanceRecord = await UserPerformance.findOne({
    user: userId,
  }).select("stage");

  if (!userPerformanceRecord) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stage: "kpi_acceptance" },
          "User performance status fetched successfully",
        ),
      );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stage: userPerformanceRecord.stage },
        "User performance status fetched successfully",
      ),
    );
});

export { performanceStatus };
