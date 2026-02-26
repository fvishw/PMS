import { Schema, Types, model, Document } from "mongoose";

interface IGoal extends Document {
  title: string;
  owner: Types.ObjectId;
  dueDate: Date;
  subTasks: { _id: Types.ObjectId; title: string; isCompleted: boolean }[];
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

const toLocalDateStart = (value: Date | string): Date => {
  if (typeof value === "string") {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsed = value instanceof Date ? value : new Date(value);
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
};

goalSchema.methods.getDueDateDifference = function (): number {
  const currentDate = toLocalDateStart(new Date());
  const dueDate = toLocalDateStart(this.dueDate);
  const timeDiff = dueDate.getTime() - currentDate.getTime();
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
