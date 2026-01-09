type Kpi = {
  objective: string;
  indicator: string;
  weight: number;
  selfScore?: number;
  selfComments?: string;
  managerScore?: number;
  managerComments?: string;
};

interface KpiData {
  kpis: Kpi[];
}

type Competency = {
  _id: string;
  title: string;
  indicators: string[];
  score?: number;
};

type CompetenciesData = Competency[];

type EditPermissions = {
  canEditSelf: boolean;
  canEditManager: boolean;
  canEditAdmin: boolean;
  canEditUserFinalComments: boolean;
};
type CriteriaType = {
  _id: string;
  selfScore?: number;
  selfComments?: string;
  managerScore?: number;
  managerComments?: string;
};
type CompetenciesType = {
  _id: string;
  score?: number;
};
type AdminComments = {
  remarks?: string;
  recommendation?: string;
  finalComments?: string;
};
type SelfComments = {
  remarks?: string;
  comments?: string;
};
type IFinalReview = {
  adminReview?: AdminComments;
  selfReview?: SelfComments;
};
interface PerformanceFormValue {
  userPerformanceId: string;
  criteria: CriteriaType[];
  competencies: CompetenciesType[];
  finalComments: IFinalReview;
}

export type {
  Kpi,
  KpiData,
  CompetenciesData,
  Competency,
  PerformanceFormValue,
  EditPermissions,
  IFinalReview,
};
