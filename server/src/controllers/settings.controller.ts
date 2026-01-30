import Settings from "@/models/settings.model.js";
import { SettingsSchema } from "@/types/settings.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";

const defaultSettings = {
  kpiStartDate: null,
  kpiEndDate: null,
  isKpiEnabled: false,
  appraisalStartDate: null,
  appraisalEndDate: null,
  isAppraisalEnabled: false,
  currentQuarter: "Q1",
  currentYear: new Date().getFullYear(),
  updatedAt: null,
};

const getCurrentSettings = asyncHandler(async (req: Request, res: Response) => {
  const currentSettings = await Settings.find().limit(1);
  if (currentSettings.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, { settings: defaultSettings }));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { settings: currentSettings[0] }));
});

const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const parsedSettings = SettingsSchema.safeParse(req.body);
  if (!parsedSettings.success) {
    return res.status(400).json(new ApiError(400, "Invalid settings data"));
  }
  const updatedSettings = await Settings.findOneAndUpdate(
    {},
    { $set: parsedSettings.data },
    { new: true, upsert: true },
  );
  return res.status(200).json(new ApiResponse(200, updatedSettings));
});

export { getCurrentSettings, updateSettings };
