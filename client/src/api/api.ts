import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosError, AxiosInstance } from "axios";

export class API {
  instance: AxiosInstance;

  isRefreshing = false;
  refreshSubscribers: ((token: string) => void)[] = [];

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
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });

    // RESPONSE INTERCEPTOR
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Access token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            const refreshToken = localStorage.getItem("refreshToken");

            const res = await axios.post(
              `${getDynamicApiUrl()}/user/auth/refresh-token`,
              {
                refreshToken,
              }
            );

            const { accessToken, refreshToken: newRefresh } = res.data;

            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", newRefresh);

            this.isRefreshing = false;

            this.refreshSubscribers.forEach((callback) =>
              callback(accessToken)
            );
            this.refreshSubscribers = [];
          }

          // queue requests until refresh done
          return new Promise((resolve) => {
            this.refreshSubscribers.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.instance(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }
}

const Api = new API();
export default Api;
