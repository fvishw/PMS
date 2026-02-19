import { SignInResponse } from "@/types/apiResponse";
import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosError, AxiosInstance } from "axios";

class PublicApi {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: getDynamicApiUrl(),
    });
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
    } catch (error: AxiosError | any) {
      const message = error?.response?.data?.message || "Something went wrong";
      throw new Error(message);
    }
  }

  signInUser(email: string, password: string): Promise<SignInResponse> {
    return this.request(
      this.instance.post("/user/auth/login", {
        email,
        password,
      }),
    );
  }

  signUpUser(email: string, password: string) {
    return this.request(
      this.instance.post("/user/auth/signup", {
        email,
        password,
      }),
    );
  }
  verifyPasswordResetToken(token: string) {
    return this.request(
      this.instance.post("/user/auth/verify-password-reset-link", {
        token,
      }),
    );
  }

  resetPassword(token: string, newPassword: string) {
    return this.request(
      this.instance.post("/user/auth/reset-password", {
        token,
        newPassword,
      }),
    );
  }

  forgotPassword(email: string) {
    return this.request(
      this.instance.post("/user/auth/send-reset-link", {
        email,
      }),
    );
  }
}

export const publicApi = new PublicApi();
