import Goal from "@/models/goal.model.js";
import { MasterPerformance } from "@/models/masterPerformance.js";
import Settings from "@/models/settings.model.js";
import { User } from "@/models/user.model.js";
import { UserPerformance } from "@/models/userPerformance.model.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";
import { Types } from "mongoose";

const performanceStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { currentQuarter, currentYear } =
    await Settings.getCurrentYearAndQuarter();

  const userPerformanceRecord = await UserPerformance.findOne({
    user: userId,
    year: currentYear,
    quarter: currentQuarter,
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

const dashBoardStats = asyncHandler(async (req: Request, res: Response) => {
  // 1: total user
  const totalUser = await User.find().countDocuments();

  // 2: active kpi
  const totalPerformanceTemplate =
    await MasterPerformance.find().countDocuments();

  // 4: complete Review
  const completeReview = await UserPerformance.find({
    stage: "completed",
  }).countDocuments();

  const result = {
    totalUser,
    totalMasterPerformanceTemplate: totalPerformanceTemplate,
    totalCompletedReview: completeReview,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stats: result },
        "Card Details fetch successfully.",
      ),
    );
});

const reviewDashboardStats = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = new Types.ObjectId(req.user?.id!);
    if (!userId) {
      throw new ApiError(401, "User not Authorized");
    }
    // 1: total pending reviews
    const pendingReview = await UserPerformance.find({
      $and: [
        {
          $or: [{ adminReviewer: userId }, { parentReviewer: userId }],
        },
        { stage: { $ne: "completed" } },
      ],
    }).countDocuments();

    // 2: total completed reviews
    const completeReview = await UserPerformance.find({
      stage: "completed",
    }).countDocuments();

    // 3: total performance templates
    const totalPerformanceTemplate =
      await MasterPerformance.find().countDocuments();

    const result = {
      totalPendingReview: pendingReview,
      totalCompletedReview: completeReview,
      totalMasterPerformanceTemplate: totalPerformanceTemplate,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { stats: result },
          "Review Card Details fetch successfully.",
        ),
      );
  },
);

const goalCardStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = new Types.ObjectId(req.user?.id!);
  if (!userId) {
    throw new ApiError(401, "User not Authorized");
  }
  // 1: total goals
  const totalGoals = await Goal.find({ isDeleted: false }).countDocuments();

  // total completed goals
  const completedGoals = await Goal.find({
    status: "completed",
    isDeleted: false,
  }).countDocuments();

  const result = {
    totalGoals,
    completedGoals,
  };
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { stats: result },
        "Goal Card Details fetch successfully.",
      ),
    );
});

export {
  performanceStatus,
  dashBoardStats,
  reviewDashboardStats,
  goalCardStats,
};
