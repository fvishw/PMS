import { Schema, model, Types } from "mongoose";

interface IUserReportSchema {
  userPerformance: Types.ObjectId;
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
  updatedAt: Date;
}

const UserReportSchema = new Schema<IUserReportSchema>(
  {
    userPerformance: {
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
  },
  { timestamps: true },
);

const UserReportModel = model<IUserReportSchema>(
  "UserReport",
  UserReportSchema,
);
export { UserReportModel, type IUserReportSchema };
