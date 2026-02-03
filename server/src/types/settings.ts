import z from "zod";

const SettingsSchema = z.object({
  kpiStartDate: z.iso.datetime(),
  kpiEndDate: z.iso.datetime(),
  isKpiEnabled: z.boolean(),
  appraisalStartDate: z.iso.datetime(),
  appraisalEndDate: z.iso.datetime(),
  isAppraisalEnabled: z.boolean(),
  currentQuarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
  currentYear: z.number().int(),
});

export { SettingsSchema };
