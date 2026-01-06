import { Schema, model, Document, Types } from "mongoose";
import type { IFinalReview, IMasterPerformance } from "./masterPerformance.ts";

interface IUserPerformance extends IMasterPerformance {
  user: Types.ObjectId;
  parentReviewer: Types.ObjectId;
  adminReviewer?: Types.ObjectId;
  isKpiLocked: boolean;
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "admin_review"
    | "user_final_review";
  interval: {
    quarterly: "Q1" | "Q2" | "Q3" | "Q4";
    year: number;
  };
}

const UserPerformanceSchema = new Schema<IUserPerformance>(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
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
    // this need to added for tracking performance by interval like quarterly and yearly
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
    parentReviewer: { type: Types.ObjectId, ref: "User", required: true },
    adminReviewer: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);
export const UserPerformance = model<IUserPerformance>(
  "UserPerformance",
  UserPerformanceSchema
);
