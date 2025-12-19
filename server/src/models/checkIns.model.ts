import { Schema, model, Document, Types } from "mongoose";

interface ICheckIn extends Document {
  employeeId: Types.ObjectId;
  date: Date;
  responses: {
    question: Types.ObjectId;
    type: "rating" | "text";
    answer: string;
  }[];
}

const CheckInSchema = new Schema<ICheckIn>(
  {
    employeeId: { type: Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    responses: [
      {
        question: { type: Types.ObjectId, ref: "Question", required: true },
        type: { type: String, enum: ["rating", "text"], required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const CheckIns = model<ICheckIn>("CheckIn", CheckInSchema);
