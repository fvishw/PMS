import { QUARTERS } from "@/constants/quarter.js";
import z from "zod";

const SettingsSchema = z.object({
  kpiStartDate: z.iso.datetime(),
  kpiEndDate: z.iso.datetime(),
  isKpiEnabled: z.boolean(),
  appraisalStartDate: z.iso.datetime(),
  appraisalEndDate: z.iso.datetime(),
  isAppraisalEnabled: z.boolean(),
  currentQuarter: z.enum(QUARTERS),
  currentYear: z.number().int(),
});

export { SettingsSchema };
