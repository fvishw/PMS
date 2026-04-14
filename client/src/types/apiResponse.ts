import {
  AllPerformanceTemplate,
  GetPerformanceTableData,
  MasterPerformance,
  UserPerformanceForm,
} from "@/types/performance";
import type { Quarter } from "./quarter";
import { Designation, IUser } from "./user";
import { ICheckInQuestion, UserCheckIn, UserPastCheckIn } from "./chekin";
import { KpiCriteria } from "./criteria";
import { Goal } from "./goal";

interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface UserPerformanceFormResponse {
  isAppraisalEnabled: boolean;
  hasUserAcceptedKpi: boolean;
  userPerformanceRecord: UserPerformanceForm | null;
}
interface GetAllUserResponse {
  users: IUser[];
  pagination: PaginationMeta;
}
interface GetUserProfileResponse {
  user: IUser;
}

interface GetAllDesignationsResponse {
  designations: Designation[];
}

interface GetCheckInQuestionResponse {
  questions: ICheckInQuestion[];
}

interface GetUserCheckInsResponse {
  checkIns: UserCheckIn[];
  pagination: PaginationMeta;
}

interface GetAllPerformanceRecordsResponse {
  performanceTemplates: AllPerformanceTemplate[];
  pagination: PaginationMeta;
}

interface GetUserKPiDetails {
  isKpiEnabled: boolean;
  hasKpiTemplate: boolean;
  hasUserAccepted: boolean;
  criteria: KpiCriteria[];
}

type GetPastCheckIns = UserPastCheckIn;

interface GetPerformanceById {
  performanceTemplate: MasterPerformance;
}

interface GetCheckInQuestions {
  questionSet: ICheckInQuestion[];
}

interface GetCheckInQuestionSets {
  questionSet: {
    _id: string;
    version: string;
    isActive: boolean;
    createdAt: string;
    designation: {
      _id: string;
      title: string;
      role: string;
    };
  }[];
  pagination: PaginationMeta;
}

interface GetUserByRole {
  users: IUser[];
}

interface GetMasterPerformance {
  performances: GetPerformanceTableData[];
  pagination: PaginationMeta;
}

interface GetGoals {
  goals: Goal[];
  stats?: {
    notStartedGoals: number;
    completedGoals: number;
    atRiskGoals: number;
    onTrackGoals: number;
    incompleteGoals: number;
  };
  pagination: PaginationMeta;
}

interface GetGoal {
  goal: Goal;
}

interface SignInResponse {
  accessToken: string;
  user: IUser;
}

interface GetCheckInById {
  checkIns: UserPastCheckIn;
}

interface GetPerformanceStatus {
  stage:
    | "kpi_acceptance"
    | "self_review"
    | "manager_review"
    | "admin_review"
    | "user_final_review"
    | "completed";
}

interface GetDashboardCardStatus {
  stats: {
    totalUser: number;
    totalMasterPerformanceTemplate: number;
    totalCompletedReview: number;
  };
}
interface GetReviewDashboardCardStatus {
  stats: {
    totalMasterPerformanceTemplate: number;
    totalCompletedReview: number;
    totalPendingReview: number;
  };
}
interface GetGoalCardStatus {
  stats: {
    notStartedGoals: number;
    completedGoals: number;
    atRiskGoals: number;
    onTrackGoals: number;
    incompleteGoals: number;
  };
}
interface GetCurrentSettings {
  settings: {
    kpiStartDate: string | null;
    kpiEndDate: string | null;
    isKpiEnabled: boolean;
    appraisalStartDate: string | null;
    appraisalEndDate: string | null;
    isAppraisalEnabled: boolean;
    currentQuarter: Quarter;
    currentYear: number;
    updatedAt: string;
  };
}

interface GetUserReports {
  reports: {
    _id: string;
    quarter: string;
    year: number;
    createdAt: string;
    overAllScore: number;
  }[];
  pagination: PaginationMeta;
}

interface GetAdminReports {
  reports: {
    _id: string;
    quarter: string;
    year: number;
    createdAt: string;
    overAllScore: number;
    user: {
      _id: string;
      fullName: string;
      email: string;
      role: "admin" | "manager" | "employee";
    };
  }[];
  pagination: PaginationMeta;
}

interface GetUserReport {
  report: {
    user: string;
    performance: string;
    summary: string;
    strengths: string[];
    improvements: string[];
    kpiHighlights: { objective: string; note: string }[];
    competencyHighlights: { title: string; note: string }[];
    alignment: { selfVsManagerGap: number; note: string };
    riskFlags: string[];
    recommendedActions: string[];
    overAllScore: number;
    createdAt: string;
    quarter: string;
    year: number;
  };
}

interface GetCurrentQuarterStatus {
  hasCurrentQuarterReport: boolean;
  isAppraisalCompleted: boolean;
}

export {
  UserPerformanceFormResponse,
  GetAllUserResponse,
  GetUserProfileResponse,
  GetAllDesignationsResponse,
  GetCheckInQuestionResponse,
  GetUserCheckInsResponse,
  GetAllPerformanceRecordsResponse,
  GetUserKPiDetails,
  GetPastCheckIns,
  GetCheckInQuestions,
  GetCheckInQuestionSets,
  GetUserByRole,
  GetMasterPerformance,
  GetGoals,
  GetGoal,
  SignInResponse,
  GetCheckInById,
  GetPerformanceById,
  GetPerformanceStatus,
  GetDashboardCardStatus,
  GetReviewDashboardCardStatus,
  GetGoalCardStatus,
  GetCurrentSettings,
  GetUserReports,
  GetAdminReports,
  GetUserReport,
  GetCurrentQuarterStatus,
  PaginationMeta,
};
