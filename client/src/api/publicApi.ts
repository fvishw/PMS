import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosError, AxiosInstance } from "axios";

class PublicApi {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: getDynamicApiUrl(),
    });
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

  singInUser(email: string, password: string) {
    return this.request(
      this.instance.post("/user/auth/login", {
        email,
        password,
      })
    );
  }

  signUpUser(email: string, password: string) {
    return this.request(
      this.instance.post("/user/auth/signup", {
        email,
        password,
      })
    );
  }
  resetPassword(email: string) {
    return this.request(
      this.instance.post("/user/auth/reset-password", {
        email,
      })
    );
  }
  verifyOtp(email: string, otp: string) {
    return this.request(
      this.instance.post("/user/auth/verify-otp", {
        email,
        otp,
      })
    );
  }
}

export const publicApi = new PublicApi();
