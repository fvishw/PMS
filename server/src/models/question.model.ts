import { model, Document, Schema } from "mongoose";

interface ICheckInQuestion {
  key: string;
  question: string;
  type: "rating" | "text";
  version: number;
  isActive: boolean;
}

const CheckInQuestionSchema = new Schema<ICheckInQuestion>(
  {
    key: { type: String, required: true, unique: true },
    question: { type: String, required: true },
    type: { type: String, enum: ["rating", "text"], required: true },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CheckInsQuestions = model<ICheckInQuestion>(
  "CheckInQuestion",
  CheckInQuestionSchema
);
