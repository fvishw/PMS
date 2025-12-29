import { model, Document, Schema } from "mongoose";

interface ICheckInQuestion extends Document {
  question: string;
  type: "rating" | "text";
  version: string;
  isActive: boolean;
  createdAt: Date;
}

const CheckInQuestionSchema = new Schema<ICheckInQuestion>({
  question: String,
  type: {
    type: String,
    enum: ["rating", "text"],
  },
  version: { type: String },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const CheckInsQuestions = model<ICheckInQuestion>(
  "CheckInQuestion",
  CheckInQuestionSchema
);
