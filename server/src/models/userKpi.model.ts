import { Schema, model, Types } from "mongoose";
import type { IMasterKpi } from "./masterKpi.model.ts";

interface IUserKpi extends IMasterKpi {
  user: Types.ObjectId;
}

const UserKpiSchema = new Schema<IUserKpi>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    designation: {
      type: Types.ObjectId,
      ref: "Designation",
      required: true,
    },
    kpiCriteria: [
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
  },
  { timestamps: true }
);


const UserKpi = model<IUserKpi>("UserKpi", UserKpiSchema);
export { UserKpi };
