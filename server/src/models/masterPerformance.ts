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
export interface IKpis {
  _id: string;
  indicator: string;
  objective: string;
  weight: number;
  selfScore: number;
  selfComments: string;
  managerScore: number;
  managerComments: string;
}

export interface ICompetency {
  _id: string;
  title: string;
  indicators: string[];
  score: number;
}

export interface IMasterPerformance extends Document {
  designation: Types.ObjectId;
  kpis: IKpis[];
  competencies: ICompetency[];
  finalReview: IFinalReview;
  createdAt: Date;
  createdBy: Types.ObjectId;
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
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
export const MasterPerformance = model<IMasterPerformance>(
  "MasterPerformance",
  MasterPerformanceSchema
);
