import { PerformanceFormValue } from "@/components/performanceManagement/addKpiTable.config";
import { CheckInPayload, ICheckInPayload } from "@/types/chekin";
import { PastCheckIns } from "@/types/response";
import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosError, AxiosInstance } from "axios";

export class API {
  instance: AxiosInstance;
  constructor(token?: string) {
    this.instance = axios.create({
      baseURL: getDynamicApiUrl(),
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    return this.request(this.instance.get("/user/performance-form"));
  }
  submitUserKpis() {
    return this.request(this.instance.put("/kpis/accept-kpi"));
  }
  fetchAllUser() {
    return this.request(this.instance.get("/user/all-user"));
  }
  fetchAllUserKpiStatus() {
    return this.request(this.instance.get("/kpis/all-user-kpi-status"));
  }
  fetchAllDesignations() {
    return this.request(this.instance.get("/user/designation/all"));
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
  fetchAllPerformanceRecords() {
    return this.request(this.instance.get("/performance/all-performance"));
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
}

const Api = new API();
export default Api;
