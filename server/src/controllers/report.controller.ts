import generateReport from "../config/aiEngine/geminiEngine.js";
import { UserReportModel } from "../models/report.model.js";
import Settings from "../models/settings.model.js";
import { UserPerformance } from "../models/userPerformance.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import { getPaginationMeta, getPaginationParams } from "../utils/pagination.js";

const getUserReports = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const { page, limit, skip } = getPaginationParams(req.query);
  const reportFilter = { user: userId };

  const [userReports, totalItems] = await Promise.all([
    UserReportModel.find(reportFilter)
      .select("quarter year overAllScore createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    UserReportModel.countDocuments(reportFilter),
  ]);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        reports: userReports,
        pagination: getPaginationMeta({ totalItems, page, limit }),
      },
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
const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;
  if (!userId) {
    throw new ApiError(400, "User ID is required");
  }
  const { reportId } = req.query;
  if (!reportId) {
    throw new ApiError(400, "Report ID is required");
  }

  const reportQuery: any = {
    _id: reportId,
  };

  if (userRole !== "admin") {
    reportQuery.user = userId;
  }

  const report = await UserReportModel.findOne(reportQuery);

  if (!report) {
    throw new ApiError(404, "Report not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, { report }, "Report fetched successfully"));
});

const getAdminReports = asyncHandler(async (req: Request, res: Response) => {
  const { quarter, year, role, search, overallScoreSort } = req.query;
  const { page, limit, skip } = getPaginationParams(req.query);

  const reportFilter: any = {};

  if (typeof quarter === "string" && quarter.trim()) {
    reportFilter.quarter = quarter.trim();
  }

  if (typeof year === "string" && year.trim()) {
    const parsedYear = Number(year);
    if (!Number.isNaN(parsedYear)) {
      reportFilter.year = parsedYear;
    }
  }

  const userFilter: {
    role?: string;
    $or?: Array<{
      fullName?: { $regex: string; $options: string };
      email?: { $regex: string; $options: string };
    }>;
  } = {};

  if (typeof role === "string" && role.trim()) {
    userFilter.role = role.trim();
  }

  if (typeof search === "string" && search.trim()) {
    const q = search.trim();
    userFilter.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
    ];
  }

  if (Object.keys(userFilter).length > 0) {
    const users = await User.find(userFilter).select("_id");
    const userIds = users.map((u) => u._id);

    if (!userIds.length) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            reports: [],
            pagination: getPaginationMeta({ totalItems: 0, page, limit }),
          },
          "Admin reports fetched successfully",
        ),
      );
    }

    reportFilter.user = { $in: userIds };
  }

  const sort =
    overallScoreSort === "asc"
      ? { overAllScore: 1 as const, createdAt: -1 as const }
      : overallScoreSort === "desc"
        ? { overAllScore: -1 as const, createdAt: -1 as const }
        : { createdAt: -1 as const };

  const [reports, totalItems] = await Promise.all([
    UserReportModel.find(reportFilter)
      .select("quarter year overAllScore createdAt user")
      .populate("user", "fullName email role")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    UserReportModel.countDocuments(reportFilter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        reports,
        pagination: getPaginationMeta({ totalItems, page, limit }),
      },
      "Admin reports fetched successfully",
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
  getAdminReports,
  generateUserReport,
  getCurrentQuarterReportStatus,
  getCurrentQuarterReport,
  getReportById,
};
