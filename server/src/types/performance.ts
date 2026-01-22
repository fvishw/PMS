import z from "zod";

const selfCriteria = z.object({
  _id: z.string(),
  selfScore: z.number().min(0),
  selfComments: z.string().max(500),
});

const managerCriteria = z.object({
  _id: z.string(),
  managerScore: z.number().min(0),
  managerComments: z.string().max(500),
});

const CompetenciesSchema = z.array(
  z.object({
    _id: z.string(),
    score: z.coerce.number().min(0).max(5),
  }),
);

const CommentSchema = z.object({
  remarks: z.string().max(50),
  recommendation: z.string().max(50),
  finalComments: z.string().max(2000),
});

const adminPayloadSchema = z.object({
  userPerformanceId: z.string(),
  adminComments: CommentSchema,
});

const selfReviewPayloadSchema = z.object({
  userPerformanceId: z.string(),
  selfReview: z.object({
    remarks: z.string().max(50),
    comments: z.string().max(2000),
  }),
});

const SelfCriteriaSchema = z.object({
  userPerformanceId: z.string(),
  criteria: z.array(selfCriteria),
});

const ManagerScorePayloadSchema = z.object({
  userPerformanceId: z.string(),
  criteria: z.array(managerCriteria),
  competencies: CompetenciesSchema,
  areaOfImprovement: z.string().max(1000),
  areaOfStrength: z.string().max(1000),
});

const KpiCriteria = z.object({
  objective: z.string(),
  indicator: z.string(),
  weight: z.coerce.number(),
});

const Competency = z.object({
  title: z.string(),
  indicators: z.array(z.string()),
});

const MasterPerformancePayload = z.object({
  designationId: z.string().min(1, "DesignationId cannot be empty"),
  kpis: z.array(KpiCriteria),
  competencies: z.array(Competency).max(4, "Maximum 4 Competency Allowed"),
});

type SelfCriteria = z.infer<typeof selfCriteria>;
type ManagerCriteria = z.infer<typeof managerCriteria>;
type Competencies = z.infer<typeof CompetenciesSchema>;

export {
  SelfCriteriaSchema,
  ManagerScorePayloadSchema,
  adminPayloadSchema,
  selfReviewPayloadSchema,
  MasterPerformancePayload,
  type SelfCriteria,
  type ManagerCriteria,
  type Competencies,
};
