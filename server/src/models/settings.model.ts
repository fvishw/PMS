import { Schema, model, Document } from "mongoose";

interface KpiSettings {
  isEnabled: boolean;
  startDate: Date;
  endDate: Date;
}
interface AppraisalSettings {
  isEnabled: boolean;
  startDate: Date;
  endDate: Date;
}

interface ISettings extends Document {
  kpiSettings: KpiSettings;
  appraisalSettings: AppraisalSettings;
  currentQuarter: string;
  currentYear: number;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    kpiSettings: {
      isEnabled: { type: Boolean, default: false },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
    appraisalSettings: {
      isEnabled: { type: Boolean, default: false },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
    currentQuarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },
    currentYear: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

const Settings = model<ISettings>("Settings", SettingsSchema);
export default Settings;
