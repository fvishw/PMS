interface SubTask {
  title: string;
  isCompleted?: boolean;
}

import { IUser } from "./user";

interface Goal {
  _id: string;
  title: string;
  owner: IUser | string;
  dueDate: string | Date;
  subTasks: SubTask[];
  status?: "on_track" | "at_risk" | "completed";
}

export { Goal, SubTask };
