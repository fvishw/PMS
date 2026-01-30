import { Schema, model, Document, Model } from "mongoose";

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
  checkIsKpiEnabled: () => Promise<boolean>;
  checkIsAppraisalEnabled: () => Promise<boolean>;
}

interface ISettingsStatics {
  checkIsKpiEnabled: () => Promise<boolean>;
  checkIsAppraisalEnabled: () => Promise<boolean>;
}

type SettingsModelType = Model<ISettings> & ISettingsStatics;

const SettingsSchema = new Schema<ISettings, SettingsModelType>(
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

SettingsSchema.statics.checkIsKpiEnabled = async function (): Promise<boolean> {
  const currentDate = new Date();
  const settings = await Settings.findOne({}).lean();
  if (!settings) {
    return false;
  }

  if (settings.isKpiEnabled && settings.kpiStartDate && settings.kpiEndDate) {
    const isActive =
      currentDate >= new Date(settings.kpiStartDate) &&
      currentDate <= new Date(settings.kpiEndDate);
    return isActive;
  }
  return false;
};

SettingsSchema.statics.checkIsAppraisalEnabled =
  async function (): Promise<boolean> {
    const currentDate = new Date();
    const settings = await Settings.findOne({}).lean();
    if (!settings) {
      return false;
    }

    if (
      settings.isAppraisalEnabled &&
      settings.appraisalStartDate &&
      settings.appraisalEndDate
    ) {
      const isActive =
        currentDate >= new Date(settings.appraisalStartDate) &&
        currentDate <= new Date(settings.appraisalEndDate);
      return isActive;
    }
    return false;
  };

const Settings = model<ISettings, SettingsModelType>(
  "Settings",
  SettingsSchema,
);
export default Settings;
