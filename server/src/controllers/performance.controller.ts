import type { Request, Response } from "express";
import { MasterKpi } from "../models/masterKpi.model.ts";
import { Performance } from "../models/performance.model.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { User } from "../models/user.model.ts";
import { UserKpi } from "../models/userKpi.model.ts";
import {
  appraiserPayloadSchema,
  ManagerScorePayloadSchema,
  MasterPerformancePayload,
  reviewerPayloadSchema,
  SelfCriteriaSchema,
  selfReviewPayloadSchema,
  type ManagerCriteria,
  type SelfCriteria,
} from "../types/performance.ts";
import MasterCompetency from "../models/masterCompetency.model.ts";
import UserCompetency from "../models/userCompetency.model.ts";

const createPerformanceRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const createdById = req.user?.id!;
    const parsedPayload = MasterPerformancePayload.safeParse(payload);

    if (!parsedPayload.success) {
      throw new ApiError(401, "Invalid Performance Payload");
    }

    const isPerformanceExist = await MasterKpi.findOne({
      designation: parsedPayload.data.designationId,
    });

    if (isPerformanceExist) {
      throw new ApiError(
        400,
        "Performance Record for this designation already exists"
      );
    }

    const { competencies, designationId, kpis } = parsedPayload.data;

    let totalWeight = 0;

    kpis.forEach((c) => {
      totalWeight += c.weight;
    });

    if (totalWeight !== 100) {
      throw new ApiError(400, "Sum of Kpi's Weight must be 100");
    }

    const kpi = new MasterKpi({
      designation: designationId,
      kpiCriteria: kpis,
      createdBy: createdById,
    });
    await kpi.save();

    const competency = new MasterCompetency({
      designation: designationId,
      competencies: competencies,
    });

    await competency.save();

    return res
      .status(201)
      .json(new ApiResponse(201, null, "KPI added successfully"));
  }
);

const updateKpiStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userDesignation = user?.designation;
  const userParentReviewer = user?.parentReviewer;

  const masterKpi = await MasterKpi.findOne({
    designation: userDesignation,
  });

  const masterCompetency = await MasterCompetency.findOne({
    designation: userDesignation,
  });

  if (!masterKpi || !masterCompetency) {
    throw new ApiError(404, "Master Template not found for user's designation");
  }

  const templateKpi = { ...JSON.parse(JSON.stringify(masterKpi)) };

  const templateCompetency = JSON.parse(
    JSON.stringify(masterCompetency.competencies)
  );

  delete templateKpi._id;

  const newUserCompetency = new UserCompetency({
    competencies: templateCompetency,
    user: userId,
    designation: userDesignation,
  });

  const newUserKpi = new UserKpi({
    ...templateKpi,
    isKpiLocked: true,
    user: userId,
  });

  await newUserKpi.save();
  await newUserCompetency.save();

  const performance = new Performance({
    userId: userId,
    kpis: newUserKpi._id,
    competencies: newUserCompetency._id,
    stage: "kpi_acceptance",
    parentReviewer: userParentReviewer,
  });
  await performance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "KPI status updated successfully"));
});

const selfReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsedCriteria = SelfCriteriaSchema.safeParse(req.body);

  if (!parsedCriteria.success) {
    throw new ApiError(400, "Invalid criteria format");
  }

  const userKpi = await UserKpi.findOne({
    isKpiLocked: true,
    user: userId,
  });

  if (!userKpi) {
    throw new ApiError(404, "User KPI not found");
  }

  parsedCriteria.data.criteria.forEach((item: SelfCriteria) => {
    const kpiCriterion = userKpi.kpiCriteria.find(
      (c) => c._id.toString() === item._id
    );
    if (kpiCriterion) {
      kpiCriterion.selfScore = item.selfScore;
      kpiCriterion.selfComments = item.selfComments;
    }
  });
  await userKpi.save();

  await Performance.updateOne(
    { userId: userId, kpis: userKpi._id },
    { stage: "self_review" }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Self review submitted successfully"));
});

const managerReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user?.id;
  const parsedPayload = ManagerScorePayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }

  if (!managerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsedCriteria = parsedPayload.data.criteria;
  const employeeId = parsedPayload.data.employeeId;

  const userKpi = await UserKpi.findOne({
    isKpiLocked: true,
    user: employeeId,
    managerId: managerId,
  });

  if (!userKpi) {
    throw new ApiError(404, "User KPI not found");
  }

  const performance = await Performance.findOne({
    userId: employeeId,
    kpis: userKpi._id,
  });

  parsedCriteria.forEach((item: ManagerCriteria) => {
    const kpiCriterion = userKpi.kpiCriteria.find(
      (c) => c._id.toString() === item._id
    );
    if (kpiCriterion) {
      kpiCriterion.managerScore = item.managerScore;
      kpiCriterion.managerComments = item.managerComments;
    }
  });

  if (!performance) {
    throw new ApiError(404, "Performance record not found");
  }

  performance.competencies = parsedPayload.data.competencies;
  performance.stage = "manager_review";

  await performance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Manager review submitted successfully"));
});

const reviewerReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = reviewerPayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }
  const reviewerId = req.user?.id;

  if (!reviewerId) {
    throw new ApiError(401, "Unauthorized");
  }
  const employeeId = parsedPayload.data.employeeId;
  // have to check if reviewer is assigned to this employee or not ?
  const performance = await Performance.findOne({
    userId: employeeId,
  });

  if (!performance) {
    throw new ApiError(404, "Performance record not found");
  }

  const reviewerComments = parsedPayload.data.reviewerComments;

  performance.finalReview.reviewerComments = reviewerComments;
  performance.stage = "reviewer_review";

  await performance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Reviewer review submitted successfully"));
});

const appraiserReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = appraiserPayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }
  const appraiserId = req.user?.id;

  if (!appraiserId) {
    throw new ApiError(401, "Unauthorized");
  }
  const employeeId = parsedPayload.data.employeeId;
  // have to check if appraiser is assigned to this employee or not ?
  const performance = await Performance.findOne({
    userId: employeeId,
  });

  if (!performance) {
    throw new ApiError(404, "Performance record not found");
  }

  const appraiserComments = parsedPayload.data.appraiserComments;

  performance.finalReview.appraiserComments = appraiserComments;
  performance.stage = "appraiser_review";

  await performance.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Appraiser review submitted successfully")
    );
});

const userFinalReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = selfReviewPayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const performance = await Performance.findOne({
    userId: userId,
  });

  if (!performance) {
    throw new ApiError(404, "Performance record not found");
  }

  const selfReviewerComments = parsedPayload.data.selfReview;

  performance.finalReview.selfReview = selfReviewerComments;
  performance.stage = "user_final_review";

  await performance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Self review submitted successfully"));
});

const getAllUserKpiStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const users = await User.aggregate;

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users fetched successfully"));
  }
);

const getAllPerformance = asyncHandler(async (req: Request, res: Response) => {
  const performances = await MasterKpi.find()
    .select("-kpiCriteria")
    .populate("createdBy", "fullName email")
    .populate("designation", "title");

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { performances },
        "Performance records fetched successfully"
      )
    );
});

export {
  createPerformanceRecord,
  updateKpiStatus,
  selfReviewKpi,
  managerReviewKpi,
  reviewerReviewKpi,
  appraiserReviewKpi,
  userFinalReviewKpi,
  getAllUserKpiStatus,
  getAllPerformance,
};
