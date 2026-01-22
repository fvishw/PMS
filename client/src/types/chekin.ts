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
  createdAt: string;
  updatedAt: string;
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

interface UserCheckIn {
  _id: string;
  user: string;
  version: string;
  createdAt: string;
  name: string;
  email: string;
}

type IAnswer = {
  _id: string;
  question: string;
  type: "rating" | "text";
  answer: string;
};

type UserPastCheckIn = {
  answers: {
    _id: string;
    question: string;
    answer: string;
    type: "rating" | "text";
  }[];
  user: string;
  version: string;
  createdAt?: string;
  _id: string;
};

interface ICheckInQuestion {
  _id: string;
  question: string;
  type: "rating" | "text";
  version: string;
  isActive: boolean;
  createdAt: string;
}
export {
  CheckInPayload,
  ICheckInsResponse,
  ICheckInPayload,
  UserCheckIn,
  IAnswer,
  UserPastCheckIn,
  ICheckInQuestion,
};
