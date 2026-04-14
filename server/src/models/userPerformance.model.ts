import type { Quarter } from "@/constants/quarter.js";
import { QUARTERS } from "@/constants/quarter.js";
import { Schema, model, Types } from "mongoose";
import type { IMasterPerformance } from "./masterPerformance.js";

export interface IUserPerformance extends IMasterPerformance {
  user: Types.ObjectId;
  parentReviewer: Types.ObjectId;
  adminReviewer: Types.ObjectId;
  projects: {
    name: string;
    achievements: {
      achievement: string;
      difficulty: string;
    }[];
  }[];
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "admin_review"
    | "user_final_review"
    | "completed";
  quarter: Quarter;
  year: number;
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
    projects: [
      {
        name: { type: String, required: true },
        achievements: [
          {
            achievement: { type: String, required: true },
            difficulty: { type: String, required: true },
          },
        ],
      },
    ],
    areaOfStrength: { type: String },
    areaOfImprovement: { type: String },
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
        "completed",
      ],
    },
    quarter: {
      type: String,
      enum: QUARTERS,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    parentReviewer: { type: Types.ObjectId, ref: "User", required: true },
    adminReviewer: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);
export const UserPerformance = model<IUserPerformance>(
  "UserPerformance",
  UserPerformanceSchema,
);
