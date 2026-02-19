import { Schema, Types, model, Document } from "mongoose";

interface IGoal extends Document {
  title: string;
  owner: Types.ObjectId;
  dueDate: Date;
  subTasks: { _id: string; title: string; isCompleted: boolean }[];
  status: "on_track" | "at_risk" | "completed";
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  quarter: string;
  year: number;
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
    status: {
      type: String,
      enum: ["on_track", "at_risk", "completed"],
      default: "on_track",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

goalSchema.index({ owner: 1 });

const Goal = model<IGoal>("Goal", goalSchema);

export default Goal;
