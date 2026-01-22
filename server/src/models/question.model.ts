import { model, Document, Schema, Types } from "mongoose";

interface ICheckInQuestion extends Document {
  question: string;
  type: "rating" | "text";
  version: string;
  isActive: boolean;
  createdAt: Date;
  designation: Types.ObjectId;
}

const CheckInQuestionSchema = new Schema<ICheckInQuestion>({
  question: { type: String, required: true },
  type: {
    type: String,
    enum: ["rating", "text"],
  },
  version: { type: String, required: true },
  isActive: { type: Boolean, default: false, required: true },
  createdAt: { type: Date, default: Date.now },
  designation: { type: Types.ObjectId, ref: "Designation", required: true },
});

export const CheckInQuestions = model<ICheckInQuestion>(
  "CheckInQuestion",
  CheckInQuestionSchema,
);

export type { ICheckInQuestion };
