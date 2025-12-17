import { Schema, model, Document, Types } from "mongoose";

interface ICompetency {
  communication: number;
  problemSolving: number;
  leadership: number;
  collaborationAndTeamwork: number;
  employeeAreaOfStrength: string;
  opportunitiesForDevelopment: string;
}

interface IDecisionAndRemarks {
  remarks: string;
  recommendation: string; //must be one of the predefined options
  finalComments: string;
}

interface ISelfReview {
  remarks: string;
  comments: string;
}

interface IFinalReview {
  appraiserComments: IDecisionAndRemarks;
  reviewerComments: IDecisionAndRemarks;
  selfReview: ISelfReview;
}

interface IPerformance extends Document {
  userId: Types.ObjectId;
  kpis: Types.ObjectId;
  competencies: ICompetency;
  finalReview: IFinalReview;
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "reviewer_review"
    | "appraiser_review"
    | "user_final_review";
  interval: {
    quarterly: "Q1" | "Q2" | "Q3" | "Q4";
    year: number;
  }; // e.g., "Q1 2024"
  parentReviewer: Types.ObjectId;
  adminReviewer?: Types.ObjectId;
  appraiserReviewer?: Types.ObjectId;
  isKpiLocked: boolean;
}

const PerformanceSchema = new Schema<IPerformance>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    kpis: { type: Types.ObjectId, ref: "UserKpi", required: true },
    competencies: {
      communication: { type: Number, max: 5, min: 1 },
      problemSolving: { type: Number, max: 5, min: 1 },
      leadership: { type: Number, max: 5, min: 1 },
      collaborationAndTeamwork: { type: Number, max: 5, min: 1 },
      employeeAreaOfStrength: { type: String },
      opportunitiesForDevelopment: { type: String },
    },
    finalReview: {
      appraiserComments: {
        remarks: { type: String },
        recommendation: { type: String },
        finalComments: { type: String },
      },
      reviewerComments: {
        remarks: { type: String },
        recommendation: { type: String },
        finalComments: { type: String },
      },
      selfReview: {
        remarks: { type: String },
        comments: { type: String },
      },
    },
    stage: {
      type: String,
      required: true,
      default: "kpi_acceptance",
      enum: [
        "kpi_acceptance",
        "self_review",
        "manager_review",
        "reviewer_review",
        "appraiser_review",
        "user_final_review",
      ],
    },
    interval: {
      quarterly: {
        type: String,
        enum: ["Q1", "Q2", "Q3", "Q4"],
        set: (v: String) => v?.toUpperCase(),
        // required: true,
      },
      year: {
        type: Number,
        // required: true
      },
    },
    managerId: { type: Types.ObjectId, ref: "User", required: true },
    isKpiLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const Performance = model<IPerformance>(
  "Performance",
  PerformanceSchema
);
