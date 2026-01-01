import { Schema, model, Document, Types } from "mongoose";

export interface IDecisionAndRemarks {
  remarks: string;
  recommendation: string;
  finalComments: string;
}

export interface ISelfReview {
  remarks: string;
  comments: string;
}

export interface IFinalReview {
  adminReview: IDecisionAndRemarks;
  selfReview: ISelfReview;
}
export interface ICriteria {
  _id: string;
  indicator: string;
  description: string;
  weight: number;
  selfScore: number;
  selfComments: string;
  managerScore: number;
  managerComments: string;
}
export interface IMasterKpi {
  kpiCriteria: ICriteria[];
}

export interface ICompetency {
  _id: string;
  title: string;
  indicators: string[];
  score: number;
}

export interface IMasterPerformance extends Document {
  designation: Types.ObjectId;
  kpis: IMasterKpi;
  competencies: ICompetency[];
  finalReview: IFinalReview;
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "admin_review"
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

const MasterPerformanceSchema = new Schema<IMasterPerformance>(
  {
    designation: { type: Types.ObjectId, ref: "Designation", required: true },
    kpis: [
      {
        objective: { type: String, required: true },
        indicator: { type: String, required: true },
        weight: { type: Number, required: true },
        selfScore: { type: Number },
        selfComments: { type: String },
        managerScore: { type: Number },
        managerComments: { type: String },
      },
    ],
    competencies: [
      {
        title: String,
        indicators: [{ type: String }],
        score: { type: Number },
      },
    ],
    finalReview: {
      adminReview: {
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
        "admin_review",
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
    isKpiLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);
export const MasterPerformance = model<IMasterPerformance>(
  "MasterPerformance",
  MasterPerformanceSchema
);
