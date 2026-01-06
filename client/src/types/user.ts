interface IDesignationOption {
  _id: string;
  title: string;
}
interface IUserFormData {
  fullName: string;
  email: string;
  role: string;
  designationId: string;
  parentReviewerId?: string;
  adminReviewerId?: string;
}

export type { IDesignationOption, IUserFormData };
