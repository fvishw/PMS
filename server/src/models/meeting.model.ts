import { Schema, Types, model, Document } from "mongoose";

interface IMeeting extends Document {
  title: string;
  admin: Types.ObjectId;
  employee: Types.ObjectId;
  meetingDate: Date;
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
  quarter: string;
  year: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const meetingSchema = new Schema<IMeeting>(
  {
    title: {
      type: String,
      required: true,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meetingDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    quarter: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

meetingSchema.index({ isDeleted: 1, quarter: 1, year: 1 });
meetingSchema.index({ employee: 1, isDeleted: 1 });
meetingSchema.index({ admin: 1, isDeleted: 1 });

const Meeting = model<IMeeting>("Meeting", meetingSchema);

export default Meeting;
