import { Schema, model, Document } from "mongoose";

interface ISettings extends Document {
  kpiStartDate: Date | null;
  kpiEndDate: Date | null;
  isKpiEnabled: boolean;
  appraisalStartDate: Date | null;
  appraisalEndDate: Date | null;
  isAppraisalEnabled: boolean;
  currentQuarter: "Q1" | "Q2" | "Q3" | "Q4";
  currentYear: number;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    kpiStartDate: { type: Date, default: null },
    kpiEndDate: { type: Date, default: null },
    isKpiEnabled: { type: Boolean, default: false },
    appraisalStartDate: { type: Date, default: null },
    appraisalEndDate: { type: Date, default: null },
    isAppraisalEnabled: { type: Boolean, default: false },
    currentQuarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },
    currentYear: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
);

const Settings = model<ISettings>("Settings", SettingsSchema);
export default Settings;
