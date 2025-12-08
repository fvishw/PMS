import { Document, Schema, model, Types } from "mongoose";
interface ICriteria extends Document {
  name: string;
  description: string;
  weight: number;
  selfScore: number;
  selfComments: string;
  managerScore: number;
  managerComments: string;
}

interface IKpi extends Document {
  designation: Types.ObjectId; // e.g., "Software Engineer", "Product Manager" must be unique by reference
  criteria: ICriteria[];
  isKpiLocked: boolean; // true as user accepts the kpis
}

const KpiSchema = new Schema<IKpi>(
  {
    designation: {
      type: Types.ObjectId,
      ref: "Designation",
      required: true,
      unique: true,
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
    isKpiLocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const MasterKpi = model<IKpi>("MasterKpi", KpiSchema);

export { MasterKpi, type IKpi };
