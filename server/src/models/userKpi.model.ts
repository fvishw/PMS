import { Schema, model, Types } from "mongoose";
import type { IKpi } from "./masterKpi.model.ts";

interface IUserKpi extends IKpi {
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
    criteria: [
      {
        name: { type: String, required: true },
        description: { type: String, required: true },
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

UserKpiSchema.index({ user: 1, designation: 1 }, { unique: true });

const UserKpi = model<IUserKpi>("UserKpi", UserKpiSchema);
export { UserKpi };
