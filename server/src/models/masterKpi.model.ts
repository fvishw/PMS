import { Document, Schema, model, Types } from "mongoose";
interface ICriteria {
  indicator: string;
  description: string;
  weight: number;
  selfScore: number;
  selfComments: string;
  managerScore: number;
  managerComments: string;
}

interface IMasterKpi extends Document {
  designation: Types.ObjectId;
  kpiCriteria: ICriteria[];
}

const MasterKpiSchema = new Schema<IMasterKpi>(
  {
    designation: {
      type: Types.ObjectId,
      ref: "Designation",
      required: true,
      unique: true,
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

const MasterKpi = model<IMasterKpi>("MasterKpi", MasterKpiSchema);

export { MasterKpi, type IMasterKpi };
