import { CheckInPayload } from "@/types/chekin";
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

  fetchUserKpi() {
    return this.request(this.instance.get("/user/kpis"));
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
        checkIns: JSON.stringify(data),
      })
    );
  }
  addCheckInsQuestions(data: any) {
    return this.request(
      this.instance.post("/check-ins/add-questions", {
        checkInsQuestions: data,
      })
    );
  }
}

const Api = new API();
export default Api;
