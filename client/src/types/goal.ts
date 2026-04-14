interface SubTask {
  _id?: string;
  title: string;
  isCompleted?: boolean;
}

import { IUser } from "./user";

interface Goal {
  _id: string;
  title: string;
  owner: IUser | string;
  dueDate: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  subTasks: SubTask[];
  status?: "on_track" | "at_risk" | "completed" | "not_started" | "incomplete";
  isCompleted: boolean;
  quarter: string;
  year: number;
}

interface UpdateGoalPayload {
  title: string;
  dueDate: string | Date;
  subTasks: Pick<SubTask, "_id" | "title">[];
}

export { Goal, SubTask, UpdateGoalPayload };
