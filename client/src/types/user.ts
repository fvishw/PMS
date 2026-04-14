interface IDesignationOption {
  _id: string;
  title: string;
  role: "employee" | "manager" | "admin";
  isActive?: boolean;
}
interface IUserFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  joiningDate: string;
  role: string;
  designationId: string;
  parentReviewerId?: string;
  adminReviewerId?: string;
}

interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  joiningDate?: Date | string | null;
  isActive?: boolean;
  role: "admin" | "employee" | "manager";
  designation?: {
    _id: string;
    title: string;
    role: "employee" | "manager" | "admin";
  } | null;
  parentReviewer?: { _id: string; fullName: string; email?: string } | null;
  adminReviewer?: { _id: string; fullName: string; email?: string } | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  isSignUpComplete?: boolean;
}

interface Designation {
  _id: string;
  role: "employee" | "manager" | "admin";
  title: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type { IDesignationOption, IUserFormData, IUser, Designation };
