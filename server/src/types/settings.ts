import z from "zod";

const SettingsSchema = z.object({
  kpiSettings: z.object({
    isEnabled: z.boolean(),
    startDate: z.date(),
    endDate: z.date(),
  }),
  appraisalSettings: z.object({
    isEnabled: z.boolean(),
    startDate: z.date(),
    endDate: z.date(),
  }),
  currentQuarter: z.enum(["Q1", "Q2", "Q3", "Q4"]),
  currentYear: z.number().int(),
  updatedAt: z.date(),
});

export { SettingsSchema };
