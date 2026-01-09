import Api from "@/api/api";

const getReviewAppraisalApi = (role: string) => {
  if (role === "admin") {
    return () => Api.getAdminReviewAppraisalData();
  } else if (role === "manager") {
    return () => Api.getManagerReviewAppraisalData();
  } else {
    throw new Error("Unauthorized role for fetching review appraisal data");
  }
};

export { getReviewAppraisalApi };
