import Settings, { SETTINGS_NAME } from "@/models/settings.model.js";

const initAppraisalSettings = async () => {
  const isSettingExist = await Settings.findOne({
    settingsName: SETTINGS_NAME,
  }).lean();
  if (!isSettingExist) {
    await Settings.create({
      settingsName: SETTINGS_NAME,
      kpiStartDate: null,
      kpiEndDate: null,
      isKpiEnabled: false,
      appraisalStartDate: null,
      appraisalEndDate: null,
      isAppraisalEnabled: false,
      currentQuarter: "Q1",
      currentYear: new Date().getFullYear(),
    });
  }
};

export default initAppraisalSettings;
