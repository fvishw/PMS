import { EditPermissions } from "@/types/performance";


interface IUser {
  _id: string;
  role: string;
  parentReviewerId?: string;
  adminReviewerId?: string;
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
  // console.log("stage", stage);
  // console.log("currentUser", currentUser);
  // console.log("employee", employee);
  return {
    canEditSelf: stage === "self_review" && employee._id === currentUser._id,
    canEditManager:
      stage === "manager_review" &&
      currentUser.role === "manager" &&
      currentUser._id === employee.parentReviewerId,
    canEditAdmin:
      stage === "admin_review" &&
      currentUser.role === "admin" &&
      currentUser._id === employee.adminReviewerId,
    canEditUserFinalComments:
      "final_review" === stage && currentUser.role === "employee",
  };
};
export type { IUser };
export default getPerformancePermission;
