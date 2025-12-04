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
  status: "pending" | "completed"; // e.g., "Pending", "In Review", "Completed"
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "reviewer_review"
    | "appraiser_review"
    | "user_review";
  interval: {
    quarterly: "Q1" | "Q2" | "Q3" | "Q4";
    year: number;
  }; // e.g., "Q1 2024"
}

const PerformanceSchema = new Schema<IPerformance>(
  {
    userId: { type: Types.ObjectId, ref: "User", required: true },
    kpis: { type: Types.ObjectId, ref: "Kpi", required: true },
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
        // accessTo: { type: Types.ObjectId, ref: "User" },
      },
      reviewerComments: {
        remarks: { type: String },
        recommendation: { type: String },
        finalComments: { type: String },
        // accessTo: { type: Types.ObjectId, ref: "User" },
      },
      selfReview: {
        remarks: { type: String },
        comments: { type: String },
      },
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: ["pending", "completed"],
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
        "user_review",
      ],
    },
    interval: {
      quarterly: {
        type: String,
        enum: ["Q1", "Q2", "Q3", "Q4"],
        // required: true,
        capitalize: true,
      },
      year: {
        type: Number,
        // required: true
      },
    },
  },
  { timestamps: true }
);
export const Performance = model<IPerformance>(
  "Performance",
  PerformanceSchema
);
