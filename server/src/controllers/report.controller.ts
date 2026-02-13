import generateReport from "@/config/aiEngine/geminiEngine.js";
import { UserReportModel } from "@/models/report.model.js";
import Settings from "@/models/settings.model.js";
import { UserPerformance } from "@/models/userPerformance.model.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";

const getUserReports = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const userReports = await UserReportModel.find({
    user: userId,
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
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const { currentYear, currentQuarter } =
    await Settings.getCurrentYearAndQuarter();

  const existingReport = await UserReportModel.findOne({
    user: userId,
    year: currentYear,
    quarter: currentQuarter,
  });

  if (existingReport) {
    throw new ApiError(409, "Report for the current quarter already exists");
  }
  const userPerformanceRecord = await UserPerformance.findOne({
    user: userId,
    year: currentYear,
    quarter: currentQuarter,
    stage: "completed",
  });

  if (!userPerformanceRecord) {
    throw new ApiError(404, "No performance records found for the user");
  }

  const aiReport = await generateReport(userPerformanceRecord);

  const newUserReport = await UserReportModel.create({
    ...aiReport,
    user: userPerformanceRecord.user,
    year: userPerformanceRecord.year,
    quarter: userPerformanceRecord.quarter,
    performance: userPerformanceRecord._id,
  });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { report: newUserReport },
        "User report generated successfully",
      ),
    );
});

const getCurrentQuarterReportStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
    const { currentYear, currentQuarter } =
      await Settings.getCurrentYearAndQuarter();

    const isAppraisalCompleted = await UserPerformance.findOne({
      user: userId,
      year: currentYear,
      quarter: currentQuarter,
      stage: "completed",
    });
    const existingReport = await UserReportModel.findOne({
      user: userId,
      year: currentYear,
      quarter: currentQuarter,
    });
    const reportExists = !!existingReport && !!isAppraisalCompleted;

    res.status(200).json(
      new ApiResponse(
        200,
        {
          hasCurrentQuarterReport: reportExists,
          isAppraisalCompleted: !!isAppraisalCompleted,
        },
        "Current quarter report status fetched successfully",
      ),
    );
  },
);

const getCurrentQuarterReport = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }
    const { currentYear, currentQuarter } =
      await Settings.getCurrentYearAndQuarter();

    const existingReport = await UserReportModel.findOne({
      user: userId,
      year: currentYear,
      quarter: currentQuarter,
    });

    if (!existingReport) {
      throw new ApiError(404, "No report found for the current quarter");
    }

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { report: existingReport },
          "Current quarter report fetched successfully",
        ),
      );
  },
);

export {
  getUserReports,
  generateUserReport,
  getCurrentQuarterReportStatus,
  getCurrentQuarterReport,
};
