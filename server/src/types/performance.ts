import z from "zod";

const selfCriteria = z.object({
  _id: z.string(),
  selfScore: z.number().min(0),
  selfComments: z.string().max(500),
});

const managerCriteria = z.object({
  _id: z.string(),
  managerScore: z.number().min(0).max(5),
  managerComments: z.string().max(500),
});

const CompetenciesSchema = z.object({
  communication: z.number().min(1).max(5),
  problemSolving: z.number().min(1).max(5),
  leadership: z.number().min(1).max(5),
  collaborationAndTeamwork: z.number().min(1).max(5),
  employeeAreaOfStrength: z.string().max(1000),
  opportunitiesForDevelopment: z.string().max(1000),
});

const CommentSchema = z.object({
  remarks: z.string().max(50),
  recommendation: z.string().max(50),
  finalComments: z.string().max(2000),
});

const appraiserPayloadSchema = z.object({
  appraiserComments: CommentSchema,
  employeeId: z.string(),
});

const reviewerPayloadSchema = z.object({
  reviewerComments: CommentSchema,
  employeeId: z.string(),
});

const selfReviewPayloadSchema = z.object({
  selfReview: z.object({
    remarks: z.string().max(50),
    comments: z.string().max(2000),
  }),
});

const SelfCriteriaSchema = z.object({
  criteria: z.array(selfCriteria),
});

const ManagerScorePayloadSchema = z.object({
  criteria: z.array(managerCriteria),
  competencies: CompetenciesSchema,
  employeeId: z.string(),
});

const KpiCriteria = z.object({
  objective: z.string(),
  indicator: z.string(),
  weight: z.number(),
});

const Competency = z.object({
  title: z.string(),
  indicators: z.array(z.string()),
});

const MasterPerformancePayload = z.object({
  designationId: z.string(),
  kpiCriteria: z.array(KpiCriteria),
  competencies: z.array(Competency).max(4, "Maximum 4 Competency Allowed"),
});

type SelfCriteria = z.infer<typeof selfCriteria>;
type ManagerCriteria = z.infer<typeof managerCriteria>;
type Competencies = z.infer<typeof CompetenciesSchema>;

export {
  SelfCriteriaSchema,
  ManagerScorePayloadSchema,
  appraiserPayloadSchema,
  reviewerPayloadSchema,
  selfReviewPayloadSchema,
  MasterPerformancePayload,
  type SelfCriteria,
  type ManagerCriteria,
  type Competencies,
};
