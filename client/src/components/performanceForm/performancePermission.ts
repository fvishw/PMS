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
  return {
    canEditSelf: stage === "self_review" && employeeId === currentUser._id,
    canEditManager:
      stage === "manager_review" &&
      currentUser.role === "manager" &&
      currentUser._id === parentReviewer,
    canEditAdmin:
      stage === "admin_review" &&
      currentUser.role === "admin" &&
      currentUser._id === adminReviewer,
    canEditUserFinalComments:
      "user_final_review" === stage && employeeId === currentUser._id,
  };
};
export default getPerformancePermission;
