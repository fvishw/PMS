import { Schema, model, Types } from "mongoose";

interface IUserReportSchema {
  user: Types.ObjectId;
  performance: Types.ObjectId;
  summary: string;
  strengths: string[];
  improvements: string[];
  kpiHighlights: { objective: string; note: string }[];
  competencyHighlights: { title: string; note: string }[];
  alignment: { selfVsManagerGap: number; note: string };
  riskFlags: string[];
  recommendedActions: string[];
  overAllScore: number;
  createdAt: Date;
  quarter: string;
  year: number;
}

const UserReportSchema = new Schema<IUserReportSchema>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    performance: {
      type: Types.ObjectId,
      ref: "UserPerformance",
      required: true,
    },
    summary: { type: String, required: true },
    strengths: [{ type: String, required: true }],
    improvements: [{ type: String, required: true }],
    kpiHighlights: [
      {
        objective: { type: String, required: true },
        note: { type: String, required: true },
      },
    ],
    competencyHighlights: [
      {
        title: { type: String, required: true },
        note: { type: String, required: true },
      },
    ],
    alignment: {
      selfVsManagerGap: { type: Number, required: true },
      note: { type: String, required: true },
    },
    riskFlags: [{ type: String, required: true }],
    recommendedActions: [{ type: String, required: true }],
    overAllScore: { type: Number, required: true },
    quarter: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { timestamps: true },
);

const UserReportModel = model<IUserReportSchema>(
  "UserReport",
  UserReportSchema,
);
export { UserReportModel, type IUserReportSchema };
