import { ViewGoalFormValues } from "@/components/goalManagement/viewGoal/viewGoalModal";
import { PerformanceFormValue as PerformanceTemplateFormValue } from "@/components/performanceManagement/addKpiTable.config";
import { SettingsValue } from "@/components/settings/settings";
import {
  GetAllUserResponse,
  GetAllDesignationsResponse,
  UserPerformanceFormResponse,
  GetCheckInQuestionResponse,
  GetAllPerformanceRecordsResponse,
  GetUserKPiDetails,
  GetPastCheckIns,
  GetCheckInQuestions,
  GetCheckInQuestionSets,
  GetUserCheckInsResponse,
  GetUserByRole,
  GetMasterPerformance,
  GetGoals,
  GetGoal,
  GetCheckInById,
  GetPerformanceById,
  GetPerformanceStatus,
  GetDashboardCardStatus,
  GetReviewDashboardCardStatus,
  GetGoalCardStatus,
  GetCurrentSettings,
} from "@/types/apiResponse";
import { CheckInPayload, ICheckInPayload } from "@/types/chekin";
import { Goal } from "@/types/goal";
import { PerformanceFormValue } from "@/types/performance";
import { IUserFormData } from "@/types/user";
import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosInstance } from "axios";

export class API {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: getDynamicApiUrl(),
    });
    this.setInterceptor();
  }

  private async request<T>(
    promise: Promise<{ data: { data: T } | T }>,
  ): Promise<T> {
    try {
      const response = await promise;
      const payload = response.data;
      if (payload && typeof payload === "object" && "data" in payload) {
        return (payload as { data: T }).data;
      }
      return payload as T;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong";
      throw new Error(message);
    }
  }

  setInterceptor() {
    this.instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("accessToken");

      if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      }

      return config;
    });
  }

  fetchUserPerformanceForm(): Promise<UserPerformanceFormResponse> {
    return this.request(this.instance.get("/performance/performance-form"));
  }
  submitUserKpis() {
    return this.request(this.instance.put("/performance/accept-kpi"));
  }
  addUser(data: IUserFormData) {
    return this.request(this.instance.post("/user/add", data));
  }

  fetchAllUser(): Promise<GetAllUserResponse> {
    return this.request(this.instance.get("/user/all-user"));
  }

  fetchAllDesignations(role?: string): Promise<GetAllDesignationsResponse> {
    return this.request(
      this.instance.get("/user/all-designations", { params: { role } }),
    );
  }
  addCheckIns(data: CheckInPayload) {
    return this.request(
      this.instance.post("/check-ins/add", {
        checkIns: data,
      }),
    );
  }
  addCheckInQuestions(CheckInPayload: ICheckInPayload) {
    return this.request(
      this.instance.post("/check-ins/add-questions", {
        checkInQuestions: CheckInPayload,
      }),
    );
  }
  getCheckIns(): Promise<GetCheckInQuestionResponse> {
    return this.request(this.instance.get("/check-ins/"));
  }

  getPastCheckIns(year: string, month: string): Promise<GetPastCheckIns> {
    return this.request(
      this.instance.get("/check-ins/past-checkins", {
        params: {
          month,
          year,
        },
      }),
    );
  }

  addPerformanceRecord(data: PerformanceTemplateFormValue) {
    return this.request(this.instance.post("/performance/add", data));
  }
  // Admin API to fetch all performance Templates
  fetchAllPerformanceRecords(): Promise<GetAllPerformanceRecordsResponse> {
    return this.request(
      this.instance.get("/performance/all-performance-templates"),
    );
  }

  fetchAllUserCheckIns(): Promise<GetUserCheckInsResponse> {
    return this.request(this.instance.get("/check-ins/user-checkins"));
  }
  fetchUserKpiDetails(): Promise<GetUserKPiDetails> {
    return this.request(this.instance.get("/performance/user-kpi-details"));
  }

  fetchCheckIn(checkInId: string): Promise<GetCheckInById> {
    return this.request(
      this.instance.get(`/check-ins/user-past-checkins/${checkInId}`),
    );
  }

  getAllQuestionByVersion(): Promise<GetCheckInQuestionSets> {
    return this.request(this.instance.get("/check-ins/question-sets"));
  }
  setActiveQuestionSet(version: string, designationId: string) {
    return this.request(
      this.instance.put("/check-ins/set-active-question-set", {
        version,
        designationId,
      }),
    );
  }
  fetchCheckInQuestions(version: string): Promise<GetCheckInQuestions> {
    return this.request(
      this.instance.get("/check-ins/questions-by-version", {
        params: {
          version,
        },
      }),
    );
  }

  addDesignation(data: { title: string; role: string }) {
    return this.request(this.instance.post("/user/add-designation", data));
  }
  fetchUsersByRole(role: string): Promise<GetUserByRole> {
    return this.request(
      this.instance.get("/user/users-by-role", { params: { role } }),
    );
  }
  fetchMasterPerformanceById(
    performanceId: string,
  ): Promise<GetPerformanceById> {
    return this.request(
      this.instance.get("/performance/performance-by-id", {
        params: { performanceId },
      }),
    );
  }

  getAdminReviewAppraisalData(): Promise<GetMasterPerformance> {
    return this.request(
      this.instance.get("/performance/review-appraisal-data"),
    );
  }
  getManagerReviewAppraisalData(): Promise<GetMasterPerformance> {
    return this.request(
      this.instance.get("/performance/manager-review-appraisal-data"),
    );
  }
  addSelfPerformanceForm(data: PerformanceFormValue) {
    return this.request(
      this.instance.put("/performance/self-review", {
        ...data,
      }),
    );
  }
  addManagerPerformanceForm(data: PerformanceFormValue) {
    return this.request(this.instance.put("/performance/manager-review", data));
  }
  addAdminPerformanceForm(data: PerformanceFormValue) {
    return this.request(this.instance.put("/performance/admin-review", data));
  }
  addFinalUserPerformanceForm(data: PerformanceFormValue) {
    return this.request(
      this.instance.put("/performance/user-final-review", data),
    );
  }
  getPerformanceFormById(
    performanceId: string,
  ): Promise<UserPerformanceFormResponse> {
    return this.request(
      this.instance.get("/performance/user-performance/by-id", {
        params: { performanceId },
      }),
    );
  }
  addGoalByAdmin(data: Goal) {
    return this.request(this.instance.post("/goals/add", data));
  }
  getAdminGoals(): Promise<GetGoals> {
    return this.request(this.instance.get("/goals/get-all/admin"));
  }
  getGoalById(goalId: string): Promise<GetGoal> {
    return this.request(this.instance.get(`/goals/get/${goalId}`));
  }
  markGoalAsComplete(data: ViewGoalFormValues) {
    return this.request(this.instance.put("/goals/mark-as-complete", data));
  }
  getGoalsByOwner(): Promise<GetGoals> {
    return this.request(this.instance.get("/goals/get-by-owner"));
  }
  getPerformanceStatus(): Promise<GetPerformanceStatus> {
    return this.request(this.instance.get("/cards/performance-status"));
  }

  getDashboardCardStatus(): Promise<GetDashboardCardStatus> {
    return this.request(this.instance.get("/cards/dashboard-status"));
  }
  getReviewCardStatus(): Promise<GetReviewDashboardCardStatus> {
    return this.request(this.instance.get("/cards/review-dashboard-status"));
  }
  getGoalCardStatus(): Promise<GetGoalCardStatus> {
    return this.request(this.instance.get("/cards/goal-dashboard-status"));
  }
  getSettings(): Promise<GetCurrentSettings> {
    return this.request(this.instance.get("/settings/"));
  }
  updateSettings(data: SettingsValue) {
    return this.request(this.instance.put("/settings/", data));
  }
}

const Api = new API();
export default Api;
