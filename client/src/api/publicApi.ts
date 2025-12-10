import { getDynamicApiUrl } from "@/utils/url";
import axios, { AxiosInstance } from "axios";

class PublicApi {
  instance: AxiosInstance;
  constructor() {
    this.instance = axios.create({
      baseURL: getDynamicApiUrl(),
    });
  }

  singInUser(email: string, password: string) {
    return this.instance.post("/user/auth/signin", {
      email,
      password,
    });
  }

  signUpUser(email: string, password: string) {
    return this.instance.post("/user/auth/signup", {
      email,
      password,
    });
  }
  resetPassword(email: string) {
    return this.instance.post("/user/auth/reset-password", {
      email,
    });
  }
  verifyOtp(email: string, otp: string) {
    return this.instance.post("/user/auth/verify-otp", {
      email,
      otp,
    });
  }
  
}

export const publicApi = new PublicApi();
