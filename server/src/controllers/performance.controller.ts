import type { Request, Response } from "express";
import { UserPerformance } from "../models/userPerformance.model.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { User } from "../models/user.model.ts";
import {
  adminPayloadSchema,
  ManagerScorePayloadSchema,
  MasterPerformancePayload,
  SelfCriteriaSchema,
  selfReviewPayloadSchema,
  type ManagerCriteria,
  type SelfCriteria,
} from "../types/performance.ts";
import { MasterPerformance, type IKpis } from "../models/masterPerformance.ts";
import { Types } from "mongoose";

const createPerformanceRecord = asyncHandler(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const createdById = req.user?.id!;
    const parsedPayload = MasterPerformancePayload.safeParse(payload);

    if (!parsedPayload.success) {
      throw new ApiError(400, "Invalid Performance Payload");
    }

    const { competencies, designationId, kpis } = parsedPayload.data;

    const isMasterPerformanceExist = await MasterPerformance.findOne({
      designation: designationId,
    });

    if (isMasterPerformanceExist) {
      throw new ApiError(
        400,
        "Performance Record for this designation already exists"
      );
    }

    let totalWeight = 0;

    kpis.forEach((c) => {
      totalWeight += c.weight;
    });

    if (totalWeight !== 100) {
      throw new ApiError(400, "Sum of Kpi's Weight must be 100");
    }

    const masterPerformance = new MasterPerformance({
      designation: designationId,
      competencies,
      kpis,
      createdBy: createdById,
    });
    await masterPerformance.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, null, "Performance record created successfully")
      );
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

  if (!userParentReviewer) {
    throw new ApiError(
      400,
      "User must have a parent reviewer assigned before accepting KPIs"
    );
  }

  const masterPerformance = await MasterPerformance.findOne({
    designation: userDesignation,
  });

  if (!masterPerformance || masterPerformance == null) {
    throw new ApiError(404, "Master Template not found for user's designation");
  }

  const masterPerformanceTemplate = {
    ...JSON.parse(JSON.stringify(masterPerformance)),
  };
  delete masterPerformanceTemplate._id;

  const userPerformance = new UserPerformance({
    ...masterPerformanceTemplate,
    user: userId,
    stage: "kpi_acceptance",
    parentReviewer: userParentReviewer,
  });
  await userPerformance.save();

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

  const { userPerformanceId, criteria } = parsedCriteria.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "User Performance record not found");
  }

  criteria.forEach((item: SelfCriteria) => {
    const userKpi = (userPerformance.kpis as unknown as IKpis[]).find(
      (c) => c._id.toString() === item._id
    );
    if (userKpi) {
      userKpi.selfScore = item.selfScore;
      userKpi.selfComments = item.selfComments;
    }
  });
  await userPerformance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Self review submitted successfully"));
});

const managerReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const managerId = req.user?.id!;
  if (!managerId) {
    throw new ApiError(401, "Unauthorized");
  }

  const parsedPayload = ManagerScorePayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }

  const { competencies, userPerformanceId, criteria } = parsedPayload.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "User KPI not found");
  }

  criteria.forEach((item: ManagerCriteria) => {
    const kpiCriterion = (userPerformance.kpis as unknown as IKpis[]).find(
      (c) => c._id.toString() === item._id
    );
    if (kpiCriterion) {
      kpiCriterion.managerScore = item.managerScore;
      kpiCriterion.managerComments = item.managerComments;
    }
  });

  competencies.forEach((comp) => {
    const userCompetency = userPerformance.competencies.find(
      (c) => c._id.toString() === comp._id
    );
    if (userCompetency) {
      userCompetency.score = comp.score;
    }
  });

  userPerformance.stage = "manager_review";

  await userPerformance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Manager review submitted successfully"));
});

const adminReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const reviewerId = req.user?.id!;
  const parsedPayload = adminPayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }
  const { userPerformanceId, adminComments } = parsedPayload.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "Performance record not found");
  }

  userPerformance.finalReview.adminReview = adminComments;
  userPerformance.stage = "admin_review";

  await userPerformance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Admin review submitted successfully"));
});

const userFinalReviewKpi = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = selfReviewPayloadSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }

  const { selfReview, userPerformanceId } = parsedPayload.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "Performance record not found");
  }

  userPerformance.finalReview.selfReview = selfReview;
  userPerformance.stage = "user_final_review";

  await userPerformance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Self review submitted successfully"));
});

const getReviewAppraisalData = asyncHandler(
  async (req: Request, res: Response) => {
    const performances = await UserPerformance.find()
      .select("-kpis -competencies -finalReview")
      .populate("user", "fullName email role")
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
  }
);

const getUserKpiDetails = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id!;

  const userPerformance = await UserPerformance.findOne({ user: userId });

  if (userPerformance) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { hasKpiTemplate: true, hasUserAccepted: true, criteria: [] },
          "User KPI details fetched successfully"
        )
      );
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const designationId = user.designation;
  const masterPerformance = await MasterPerformance.findOne({
    designation: new Types.ObjectId(designationId),
  });

  if (!masterPerformance) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { hasKpiTemplate: false, hasUserAccepted: false, criteria: [] },
          "User KPI details fetched successfully"
        )
      );
  }

  const userKpis = masterPerformance.kpis;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        hasKpiTemplate: true,
        hasUserAccepted: false,
        criteria: userKpis,
      },
      "User KPI details fetched successfully"
    )
  );
});

const getAllPerformanceTemplates = asyncHandler(
  async (req: Request, res: Response) => {
    const performanceTemplates = await MasterPerformance.find()
      .select("-kpis -competencies")
      .populate("designation", "title role")
      .populate("createdBy", "fullName");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { performanceTemplates },
          "Performance templates fetched successfully"
        )
      );
  }
);

const getUserPerformanceForm = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;

    const userPerformanceRecord = await UserPerformance.findOne({
      user: userId,
    });

    if (!userPerformanceRecord) {
      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { hasUserAcceptedKpi: false, performanceForm: null },
            "User has not accepted KPI yet"
          )
        );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          hasUserAcceptedKpi: true,
          userPerformanceRecord,
        },
        "User KPIs fetched successfully"
      )
    );
  }
);

const getPerformanceTemplateById = asyncHandler(
  async (req: Request, res: Response) => {
    const performanceId = req.query.performanceId as string;

    if (!performanceId || !Types.ObjectId.isValid(performanceId)) {
      throw new ApiError(400, "Invalid performance ID");
    }

    const performanceTemplate = await MasterPerformance.findById(performanceId)
      .populate("designation", "title role")
      .populate("createdBy", "fullName");

    if (!performanceTemplate) {
      throw new ApiError(404, "Performance template not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { performanceTemplate },
          "Performance template fetched successfully"
        )
      );
  }
);
export {
  createPerformanceRecord,
  updateKpiStatus,
  selfReviewKpi,
  managerReviewKpi,
  adminReviewKpi,
  userFinalReviewKpi,
  getReviewAppraisalData,
  getUserKpiDetails,
  getAllPerformanceTemplates,
  getUserPerformanceForm,
  getPerformanceTemplateById,
};
