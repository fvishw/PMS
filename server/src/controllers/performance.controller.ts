import type { Request, Response } from "express";
import { UserPerformance } from "@/models/userPerformance.model.js";
import asyncHandler from "@/utils/asyncHandler.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import { User } from "@/models/user.model.js";
import {
  adminPayloadSchema,
  ManagerScorePayloadSchema,
  MasterPerformancePayload,
  SelfCriteriaSchema,
  selfReviewPayloadSchema,
  type ManagerCriteria,
  type SelfCriteria,
} from "@/types/performance.js";
import { MasterPerformance, type IKpis } from "@/models/masterPerformance.js";
import { Types } from "mongoose";
import Settings from "@/models/settings.model.js";

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
        "Performance Record for this designation already exists",
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
        new ApiResponse(201, null, "Performance record created successfully"),
      );
  },
);

const updateKpiStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const isKpiActive = await Settings.checkIsKpiEnabled();

  if (!isKpiActive) {
    throw new ApiError(400, "KPI process is currently disabled");
  }

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const settings = await Settings.findOne({});
  if (!settings) {
    throw new ApiError(500, "Settings not configured");
  }
  const { currentYear, currentQuarter } =
    await Settings.getCurrentYearAndQuarter();

  const userDesignation = user?.designation;
  const userParentReviewer = user?.parentReviewer;

  if (!userParentReviewer) {
    throw new ApiError(
      400,
      "User must have a parent reviewer assigned before accepting KPIs",
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

  const parentReviewerId = userParentReviewer;
  const adminReviewerId = user?.adminReviewer
    ? user.adminReviewer
    : parentReviewerId;

  const userPerformance = new UserPerformance({
    ...masterPerformanceTemplate,
    user: userId,
    stage: "self_review",
    parentReviewer: parentReviewerId,
    adminReviewer: adminReviewerId,
    quarter: currentQuarter,
    year: currentYear,
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
      (c) => c._id.toString() === item._id,
    );
    if (userKpi) {
      userKpi.selfScore = item.selfScore;
      userKpi.selfComments = item.selfComments;
    }
  });
  userPerformance.stage = "manager_review";
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

  const {
    competencies,
    userPerformanceId,
    criteria,
    areaOfImprovement,
    areaOfStrength,
  } = parsedPayload.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "User KPI not found");
  }

  criteria.forEach((item: ManagerCriteria) => {
    const kpiCriterion = (userPerformance.kpis as unknown as IKpis[]).find(
      (c) => c._id.toString() === item._id,
    );
    if (kpiCriterion) {
      kpiCriterion.managerScore = item.managerScore;
      kpiCriterion.managerComments = item.managerComments;
    }
  });

  competencies.forEach((comp) => {
    const userCompetency = userPerformance.competencies.find(
      (c) => c._id.toString() === comp._id,
    );
    if (userCompetency) {
      userCompetency.score = comp.score;
    }
  });

  userPerformance.stage = "admin_review";
  userPerformance.areaOfImprovement = areaOfImprovement;
  userPerformance.areaOfStrength = areaOfStrength;

  await userPerformance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Manager review submitted successfully"));
});

const adminReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewerId = req.user?.id!;
  const { userPerformanceId: performanceId, finalComments } = req.body;
  const parsedPayload = adminPayloadSchema.safeParse({
    userPerformanceId: performanceId,
    adminComments: finalComments?.adminReview,
  });

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }
  const { userPerformanceId, adminComments } = parsedPayload.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "Performance record not found");
  }

  userPerformance.finalReview.adminReview = adminComments;
  userPerformance.stage = "user_final_review";

  await userPerformance.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Admin review submitted successfully"));
});

const userFinalReview = asyncHandler(async (req: Request, res: Response) => {
  const { finalComments: userFinalComments, userPerformanceId: performanceId } =
    req.body;
  const parsedPayload = selfReviewPayloadSchema.safeParse({
    selfReview: userFinalComments?.selfReview,
    userPerformanceId: performanceId,
  });

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid payload format");
  }

  const { selfReview, userPerformanceId } = parsedPayload.data;

  const userPerformance = await UserPerformance.findById(userPerformanceId);

  if (!userPerformance) {
    throw new ApiError(404, "Performance record not found");
  }

  userPerformance.finalReview.selfReview = selfReview;
  userPerformance.stage = "completed";

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
          "Performance records fetched successfully",
        ),
      );
  },
);

const getUserKpiDetails = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id!;
  const isKpiActive = await Settings.checkIsKpiEnabled();

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!isKpiActive) {
    return res.status(200).json({
      isKpiEnabled: false,
      hasKpiTemplate: false,
      hasUserAccepted: true,
      criteria: [],
    });
  }
  const userPerformance = await UserPerformance.findOne({ user: userId });

  if (userPerformance) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isKpiEnabled: true,
          hasKpiTemplate: true,
          hasUserAccepted: true,
          criteria: [],
        },
        "User KPI details fetched successfully",
      ),
    );
  }

  const designationId = user.designation;
  const masterPerformance = await MasterPerformance.findOne({
    designation: new Types.ObjectId(designationId),
  });

  if (!masterPerformance) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          isKpiEnabled: true,
          hasKpiTemplate: false,
          hasUserAccepted: false,
          criteria: [],
        },
        "User KPI details fetched successfully",
      ),
    );
  }

  const userKpis = masterPerformance.kpis;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isKpiEnabled: true,
        hasKpiTemplate: true,
        hasUserAccepted: false,
        criteria: userKpis,
      },
      "User KPI details fetched successfully",
    ),
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
          "Performance templates fetched successfully",
        ),
      );
  },
);

const getUserPerformanceForm = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id!;

    const isAppraisalActive = await Settings.checkIsAppraisalEnabled();

    if (!isAppraisalActive) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            hasUserAcceptedKpi: false,
            performanceForm: null,
            isAppraisalEnabled: false,
          },
          "Appraisal process is currently disabled",
        ),
      );
    }

    const userPerformanceRecord = await UserPerformance.findOne({
      user: userId,
    });

    if (!userPerformanceRecord) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            isAppraisalEnabled: true,
            hasUserAcceptedKpi: false,
            performanceForm: null,
          },
          "User has not accepted KPI yet",
        ),
      );
    }
    const user = await User.findById(userPerformanceRecord.user).select(
      "fullName email role parentReviewer adminReviewer",
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          hasUserAcceptedKpi: true,
          userPerformanceRecord,
          user,
          isAppraisalEnabled: true,
        },
        "User KPIs fetched successfully",
      ),
    );
  },
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
          "Performance template fetched successfully",
        ),
      );
  },
);
const getUserPerformanceFormById = asyncHandler(
  async (req: Request, res: Response) => {
    const { performanceId } = req.query;

    const isAppraisalActive = await Settings.checkIsAppraisalEnabled();

    if (!isAppraisalActive) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            hasUserAcceptedKpi: false,
            performanceForm: null,
            isAppraisalEnabled: false,
          },
          "Appraisal process is currently disabled",
        ),
      );
    }

    if (!performanceId || !Types.ObjectId.isValid(performanceId)) {
      throw new ApiError(400, "Invalid performance ID");
    }
    const userPerformanceRecord = await UserPerformance.findById(performanceId);

    if (!userPerformanceRecord) {
      return res.status(200).json(
        new ApiResponse(
          200,
          {
            hasUserAcceptedKpi: false,
            performanceForm: null,
            isAppraisalEnabled: true,
          },
          "User has not accepted KPI yet",
        ),
      );
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          hasUserAcceptedKpi: true,
          userPerformanceRecord,
          isAppraisalEnabled: true,
        },
        "User KPIs fetched successfully",
      ),
    );
  },
);

const getManagerReviewAppraisalData = asyncHandler(
  async (req: Request, res: Response) => {
    const managerId = req.user?.id!;

    const performances = await UserPerformance.find({
      parentReviewer: managerId,
    })
      .select("-kpis -competencies -finalReview")
      .populate("user", "fullName email role")
      .populate("designation", "title");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { performances },
          "Performance records fetched successfully",
        ),
      );
  },
);

export {
  createPerformanceRecord,
  updateKpiStatus,
  selfReviewKpi,
  managerReviewKpi,
  adminReview,
  userFinalReview,
  getReviewAppraisalData,
  getUserKpiDetails,
  getAllPerformanceTemplates,
  getUserPerformanceForm,
  getPerformanceTemplateById,
  getUserPerformanceFormById,
  getManagerReviewAppraisalData,
};
