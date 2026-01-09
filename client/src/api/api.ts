import { PerformanceFormValue } from "@/components/performanceManagement/addKpiTable.config";
import { CheckInPayload, ICheckInPayload } from "@/types/chekin";
import { PastCheckIns } from "@/types/response";
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

  private async request<T>(promise: Promise<{ data: T }>): Promise<T> {
    try {
      const response = await promise;
      return response.data;
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

  fetchUserPerformanceForm() {
    return this.request(this.instance.get("/performance/performance-form"));
  }
  submitUserKpis() {
    return this.request(this.instance.put("/performance/accept-kpi"));
  }
  addUser(data: IUserFormData) {
    return this.request(this.instance.post("/user/add", data));
  }

  fetchAllUser() {
    return this.request(this.instance.get("/user/all-user"));
  }
  fetchAllUserKpiStatus() {
    return this.request(this.instance.get("/kpis/all-user-kpi-status"));
  }
  fetchAllDesignations(role?: string) {
    return this.request(
      this.instance.get("/user/all-designations", { params: { role } })
    );
  }
  addCheckIns(data: CheckInPayload) {
    return this.request(
      this.instance.post("/check-ins/add", {
        checkIns: data,
      })
    );
  }
  addCheckInQuestions(CheckInPayload: ICheckInPayload) {
    return this.request(
      this.instance.post("/check-ins/add-questions", {
        checkInQuestions: CheckInPayload,
      })
    );
  }
  getCheckIns() {
    return this.request(this.instance.get("/check-ins/"));
  }
  getPastCheckIns(year: string, month: string): Promise<PastCheckIns> {
    return this.request(
      this.instance.get("/check-ins/past-checkins", {
        params: {
          month,
          year,
        },
      })
    );
  }
  addPerformanceRecord(data: PerformanceFormValue) {
    return this.request(this.instance.post("/performance/add", data));
  }
  // Admin API to fetch all performance Templates
  fetchAllPerformanceRecords() {
    return this.request(
      this.instance.get("/performance/all-performance-templates")
    );
  }
  fetchAllUserCheckIns() {
    return this.request(this.instance.get("/check-ins/user-checkins"));
  }
  fetchUserKpiDetails() {
    return this.request(this.instance.get("/performance/user-kpi-details"));
  }

  fetchCheckIn(checkInId: string): Promise<PastCheckIns> {
    return this.request(
      this.instance.get(`/check-ins/user-past-checkins/${checkInId}`)
    );
  }
  getAllQuestionByVersion() {
    return this.request(this.instance.get("/check-ins/question-sets"));
  }
  setActiveQuestionSet(version: string) {
    return this.request(
      this.instance.put("/check-ins/set-active-question-set", {
        version,
      })
    );
  }
  fetchCheckInQuestions(version: string) {
    return this.request(
      this.instance.get("/check-ins/questions-by-version", {
        params: {
          version,
        },
      })
    );
  }

  addDesignation(data: { title: string; role: string }) {
    return this.request(this.instance.post("/user/add-designation", data));
  }
  fetchUsersByRole(role: string) {
    return this.request(
      this.instance.get("/user/users-by-role", { params: { role } })
    );
  }
  fetchMasterPerformanceById(performanceId: string) {
    return this.request(
      this.instance.get("/performance/performance-by-id", {
        params: { performanceId },
      })
    );
  }
  getAdminReviewAppraisalData() {
    return this.request(
      this.instance.get("/performance/review-appraisal-data")
    );
  }
  getManagerReviewAppraisalData() {
    return this.request(
      this.instance.get("/performance/manager-review-appraisal-data")
    );
  }
  addSelfPerformanceForm(data: PerformanceFormValue) {
    return this.request(
      this.instance.put("/performance/self-review", {
        ...data,
      })
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
      this.instance.put("/performance/user-final-review", data)
    );
  }
  getPerformanceFormById(performanceId: string) {
    return this.request(
      this.instance.get(`/performance/user-performance/by-id`, {
        params: { performanceId },
      })
    );
  }
}

const Api = new API();
export default Api;
