import { PerformanceFormValue } from "@/components/performanceManagement/addKpiTable.config";
import { CheckInPayload, ICheckInPayload } from "@/types/chekin";
import { PastCheckIns } from "@/types/response";
import { IUserFormData } from "@/types/user";
import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosError, AxiosInstance } from "axios";

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
    } catch (error: AxiosError | any) {
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
  addCheckInsQuestions(CheckInPayload: ICheckInPayload) {
    return this.request(
      this.instance.post("/check-ins/add-questions", {
        checkInsQuestions: CheckInPayload,
      })
    );
  }
  getCheckIns() {
    return this.request(this.instance.get("/check-ins/"));
  }
  getPastCheckIns(year: number, month: number): Promise<PastCheckIns> {
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
  fetchUserPastCheckIns(employeeId: string): Promise<PastCheckIns> {
    return this.request(
      this.instance.get("/check-ins/user-past-checkins", {
        params: {
          employeeId,
        },
      })
    );
  }

  fetchCheckIn(checkInId: string): Promise<PastCheckIns> {
    return this.request(
      this.instance.get("/check-ins/user-past-checkins", {
        params: {
          checkInId,
        },
      })
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
  fetchPerformanceById(performanceId: string) {
    return this.request(
      this.instance.get("/performance/performance-by-id", {
        params: { performanceId },
      })
    );
  }
}

const Api = new API();
export default Api;
