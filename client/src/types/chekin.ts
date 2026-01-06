import { CheckInFormValue } from "@/components/checkIns/newCheckIn";

interface CheckInPayload {
  [key: number]: CheckInFormValue;
}

interface IUser {
  _id: string;
  fullName: string;
  email: string;
}

interface ICheckIn {
  _id: string;
  user: IUser;
  version: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

interface ICheckInsResponse {
  checkIns: ICheckIn[];
}

interface ICheckInPayload {
  designationId?: string;
  questions: {
    question: string;
    type: string;
  }[];
  version: string;
}

export { CheckInPayload, ICheckInsResponse, ICheckInPayload };
