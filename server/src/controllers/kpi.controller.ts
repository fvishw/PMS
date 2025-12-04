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
  reviewerPayloadSchema,
  SelfCriteriaSchema,
  selfReviewPayloadSchema,
  type ManagerCriteria,
  type SelfCriteria,
} from "../types/performance.ts";

const addKpi = asyncHandler(async (req: Request, res: Response) => {
  const { designationId, criteria } = req.body;
  if (
    !designationId ||
    !criteria ||
    !Array.isArray(criteria) ||
    criteria.length === 0
  ) {
    throw new ApiError(400, "Designation and criteria are required");
  }

  const kpi = new MasterKpi({
    designation: designationId,
    criteria,
  });
  const newKpi = await kpi.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newKpi, "KPI added successfully"));
});

const updateKpiStatus = asyncHandler(async (req: Request, res: Response) => {
  const { managerId } = req.body;
  const userId = req.user?.id;

  const user = await User.findById(userId).select("designation").lean();

  if (!user || !user.designation) {
    throw new ApiError(404, "User or designation not found");
  }

  const masterKpi = await MasterKpi.findOne({
    designation: user.designation,
  }).lean();

  if (!masterKpi) {
    throw new ApiError(404, "KPI not found for user's designation");
  }

  const templateKpi = {
    ...JSON.parse(JSON.stringify(masterKpi)),
  };

  delete templateKpi._id;

  const newUserKpi = new UserKpi({
    ...templateKpi,
    isKpiLocked: true,
    user: userId,
    managerId: managerId,
  });

  await newUserKpi.save();

  const performance = new Performance({
    userId: userId,
    kpis: newUserKpi._id,
    stage: "kpi_acceptance",
    status: "completed",
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
  }).lean();

  if (!userKpi) {
    throw new ApiError(404, "User KPI not found");
  }

  parsedCriteria.data.criteria.forEach((item: SelfCriteria) => {
    const kpiCriterion = userKpi.criteria.find(
      (c) => c._id.toString() === item._id
    );
    if (kpiCriterion) {
      kpiCriterion.selfScore = item.selfScore;
      kpiCriterion.selfComments = item.selfComments;
    }
  });
  await UserKpi.updateOne({ _id: userKpi._id }, { criteria: userKpi.criteria });

  await Performance.updateOne(
    { userId: userId, kpis: userKpi._id },
    { stage: "self_review", status: "completed" }
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
  }).lean();

  if (!userKpi) {
    throw new ApiError(404, "User KPI not found");
  }

  const performance = await Performance.findOne({
    userId: employeeId,
    kpis: userKpi._id,
  });

  parsedCriteria.forEach((item: ManagerCriteria) => {
    const kpiCriterion = userKpi.criteria.find(
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
  performance.status = "completed";

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
  performance.status = "completed";

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
  performance.status = "completed";

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
  performance.stage = "self_review";
  performance.status = "completed";

  await performance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Self review submitted successfully"));
});

export {
  addKpi,
  updateKpiStatus,
  selfReviewKpi,
  managerReviewKpi,
  reviewerReviewKpi,
  appraiserReviewKpi,
  userFinalReviewKpi,
};
