import Settings from "@/models/settings.model.js";
import { SettingsSchema } from "@/types/settings.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";

const defaultSettings = {
  kpiSettings: {
    isEnabled: false,
    startDate: null,
    endDate: null,
  },
  appraisalSettings: {
    isEnabled: false,
    startDate: null,
    endDate: null,
  },
  currentQuarter: "Q1",
  currentYear: new Date().getFullYear(),
  updatedAt: null,
};

const getCurrentSettings = asyncHandler(async (req: Request, res: Response) => {
  const currentSettings = await Settings.find().limit(1);
  if (currentSettings.length === 0) {
    return res.status(200).json(new ApiResponse(200, defaultSettings));
  }

  return res.status(200).json(new ApiResponse(200, currentSettings[0]));
});

const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const parsedSettings = SettingsSchema.parse(req.body);
  const updatedSettings = await Settings.findOneAndUpdate(
    {},
    { $set: parsedSettings },
    { new: true, upsert: true },
  );
  return res.status(200).json(new ApiResponse(200, updatedSettings));
});

export { getCurrentSettings, updateSettings };
