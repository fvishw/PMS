import { Schema, Types, model, Document } from "mongoose";

interface IGoal extends Document {
  title: string;
  owner: Types.ObjectId;
  dueDate: Date;
  subTasks: { _id: string; title: string; isCompleted: boolean }[];
  status: "on_track" | "at_risk" | "completed";
  createdAt: Date;
  updatedAt: Date;
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
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["on_track", "at_risk", "completed"],
      default: "on_track",
    },
  },
  { timestamps: true },
);

goalSchema.index({ owner: 1 });

const Goal = model<IGoal>("Goal", goalSchema);

export default Goal;
