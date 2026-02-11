import { EditPermissions } from "@/types/performance";
import { IUser } from "@/types/user";

interface PerformancePermissionParams {
  stage: string;
  currentUser: IUser;
  parentReviewer: string;
  adminReviewer: string;
  employeeId: string;
}

const getPerformancePermission = ({
  stage,
  currentUser,
  parentReviewer,
  adminReviewer,
  employeeId,
}: PerformancePermissionParams): EditPermissions => {
  const currentUserId = String(currentUser?._id ?? "");
  const employeeUserId = String(employeeId ?? "");
  const parentReviewerId = String(parentReviewer ?? "");
  const adminReviewerId = String(adminReviewer ?? "");
  return {
    canEditSelf: stage === "self_review" && employeeUserId === currentUserId,
    canEditManager:
      stage === "manager_review" &&
      currentUser.role === "manager" &&
      currentUserId === parentReviewerId,
    canEditAdmin:
      stage === "admin_review" &&
      currentUser.role === "admin" &&
      currentUserId === adminReviewerId,
    canEditUserFinalComments:
      "user_final_review" === stage && employeeUserId === currentUserId,
  };
};
export default getPerformancePermission;
