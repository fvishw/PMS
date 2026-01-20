interface IDesignationOption {
  _id: string;
  title: string;
  role: "employee" | "manager" | "admin";
}
interface IUserFormData {
  fullName: string;
  email: string;
  role: string;
  designationId: string;
  parentReviewerId?: string;
  adminReviewerId?: string;
}

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "employee" | "manager";
  designation: { _id: string; title: string };
  parentReviewer: { _id: string; fullName: string };
  createdAt: Date | string;
  updatedAt: Date | string;
  isSignUpComplete?: boolean;
}

interface Designation {
  _id: string;
  role: "employee" | "manager" | "admin";
  title: string;
}

export type { IDesignationOption, IUserFormData, IUser, Designation };
