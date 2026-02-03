import { KPI } from "@/components/performanceForm/kpiTableConfig";

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
  kpis: KPI[];
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
  areaOfStrength: string;
  areaOfImprovement: string;
  competencies: CompetenciesType[];
  finalComments: IFinalReview;
}

interface MasterPerformance {
  designation: {
    _id: string;
    title: string;
    role: string;
  };
  kpis: IKpis[];
  competencies: ICompetency[];
  finalReview: IFinalReview;
  createdAt: Date;
  createdBy: {
    _id: string;
    fullName: string;
  };
}

export interface IKpis {
  _id: string;
  indicator: string;
  objective: string;
  weight: number;
  selfScore?: number;
  selfComments?: string;
  managerScore?: number;
  managerComments?: string;
}
export interface ICompetency {
  _id: string;
  title: string;
  indicators: string[];
  score?: number;
}

interface UserPerformanceForm {
  _id: string;
  designation: string;
  kpis: IKpis[];
  competencies: ICompetency[];
  finalReview: IFinalReview;
  createdAt: Date;
  createdBy: string;
  user: string;
  parentReviewer: string;
  adminReviewer?: string;
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "admin_review"
    | "user_final_review"
    | "completed";
  quarter: "Q1" | "Q2" | "Q3" | "Q4";
  year: number;
}

interface AllPerformanceTemplate {
  _id: string;
  designation: {
    _id: string;
    title: string;
    role: string;
  };
  createdAt: Date;
  createdBy: {
    _id: string;
    fullName: string;
    email: string;
  };
}

interface GetPerformanceTableData {
  _id: string;
  user: {
    fullName: string;
    role: string;
  };
  designation: {
    title: string;
  };
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "admin_review"
    | "user_final_review"
    | "completed";
  interval?: {
    quarterly: "Q1" | "Q2" | "Q3" | "Q4";
    year: number;
  };
}

export type {
  Kpi,
  KpiData,
  CompetenciesData,
  Competency,
  PerformanceFormValue,
  EditPermissions,
  IFinalReview,
  UserPerformanceForm,
  AllPerformanceTemplate,
  MasterPerformance,
  GetPerformanceTableData,
};
