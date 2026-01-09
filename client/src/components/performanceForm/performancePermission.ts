import { EditPermissions } from "@/types/performance";

interface IUser {
  _id: string;
  role: string;
  parentReviewer?: string;
  adminReviewer?: string;
}

const getPerformancePermission = ({
  stage,
  currentUser,
  employee,
}: {
  stage: string;
  currentUser: IUser;
  employee: IUser;
}): EditPermissions => {
  return {
    canEditSelf: stage === "self_review" && employee._id === currentUser._id,
    canEditManager:
      stage === "manager_review" &&
      currentUser.role === "manager" &&
      currentUser._id === employee.parentReviewer,
    canEditAdmin:
      stage === "admin_review" &&
      currentUser.role === "admin" &&
      currentUser._id === employee.adminReviewer,
    canEditUserFinalComments:
      "user_final_review" === stage && currentUser.role === "employee",
  };
};
export type { IUser };
export default getPerformancePermission;
