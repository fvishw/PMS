import Api from "@/api/api";
import type { PaginationParams } from "@/api/types";

const getReviewAppraisalApi = (role: string, params?: PaginationParams) => {
  if (role === "admin") {
    return () => Api.getAdminReviewAppraisalData(params);
  } else if (role === "manager") {
    return () => Api.getManagerReviewAppraisalData(params);
  } else {
    throw new Error("Unauthorized role for fetching review appraisal data");
  }
};

export { getReviewAppraisalApi };
