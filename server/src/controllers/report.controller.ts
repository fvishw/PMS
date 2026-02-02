import { UserReportModel } from "@/models/report.model.js";
import Settings from "@/models/settings.model.js";
import { UserPerformance } from "@/models/userPerformance.model.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";
import { report } from "process";

const getUserReports = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const userReports = await UserReportModel.find({
    userPerformance: userId,
  }).select("quarter year overAllScore createdAt");

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { reports: userReports },
        "User reports fetched successfully",
      ),
    );
});

const generateUserReport = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const { currentYear, currentQuarter } =
    await Settings.getCurrentYearAndQuarter();

  const existingReport = await UserReportModel.findOne({
    user: userId,
    year: currentYear,
    quarter: currentQuarter,
  });

  if (existingReport) {
    throw new ApiError(400, "Report for the current quarter already exists");
  }

  const userPerformanceRecords = await UserPerformance.findOne({
    user: userId,
    year: currentYear,
    quarter: currentQuarter,
  });

  if (!userPerformanceRecords) {
    throw new ApiError(404, "No performance records found for the user");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "User report generated successfully"));
});

export { getUserReports, generateUserReport };
