import {
  AllPerformanceTemplate,
  GetPerformanceTableData,
  UserPerformanceForm,
} from "@/types/performance";
import { Designation, IUser } from "./user";
import { ICheckInQuestion, UserCheckIn, UserPastCheckIn } from "./chekin";
import { KpiCriteria } from "./criteria";
import { Goal } from "./goal";

interface UserPerformanceFormResponse {
  hasUserAcceptedKpi: boolean;
  userPerformanceRecord: UserPerformanceForm | null;
}
interface GetAllUserResponse {
  users: IUser[];
}

interface GetAllDesignationsResponse {
  designations: Designation[];
}

interface GetCheckInQuestionResponse {
  questions: ICheckInQuestion[];
}

interface GetUserCheckInsResponse {
  checkIns: UserCheckIn[];
}

interface GetAllPerformanceRecordsResponse {
  performanceTemplates: AllPerformanceTemplate[];
}

interface GetUserKPiDetails {
  hasKpiTemplate: boolean;
  hasUserAccepted: boolean;
  criteria: KpiCriteria[];
}

type GetPastCheckIns = UserPastCheckIn;

interface GetPerformanceById {
  performanceTemplate: UserPerformanceForm;
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
  }[];
}

interface GetUserByRole {
  users: IUser[];
}

interface GetMasterPerformance {
  performances: GetPerformanceTableData[];
}

interface GetGoals {
  goals: Goal[];
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

export {
  UserPerformanceFormResponse,
  GetAllUserResponse,
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
};
