import { Schema, Types, model, Document } from "mongoose";

interface IGoal extends Document {
  title: string;
  owner: Types.ObjectId;
  dueDate: Date;
  subTasks: { _id?: Types.ObjectId; title: string; isCompleted: boolean }[];
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  quarter: string;
  year: number;
  getDueDateDifference(): number;
  getStatus(): "on_track" | "at_risk" | "completed" | "not_started";
}

const goalSchema = new Schema<IGoal>(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subTasks: [
      {
        title: {
          type: String,
          required: true,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    quarter: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

goalSchema.index({ owner: 1 });

goalSchema.methods.getDueDateDifference = function (): number {
  const currentDate = new Date();
  const timeDiff = this.dueDate.getTime() - currentDate.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

goalSchema.methods.getStatus = function ():
  | "on_track"
  | "at_risk"
  | "completed"
  | "not_started" {
  const goal = this;
  if (goal.isCompleted) {
    return "completed";
  }
  const totalSubTasks = goal.subTasks.length;
  const completedSubTasks = goal.subTasks.filter(
    (task: any) => task.isCompleted,
  ).length;
  const dayDiff = goal.getDueDateDifference();
  if (completedSubTasks === totalSubTasks && totalSubTasks > 0) {
    return "completed";
  }
  if (completedSubTasks > 0 && completedSubTasks < totalSubTasks) {
    return "on_track";
  }
  if (completedSubTasks < totalSubTasks && dayDiff <= 3) {
    return "at_risk";
  }
  return "not_started";
};

const Goal = model<IGoal>("Goal", goalSchema);

export default Goal;
