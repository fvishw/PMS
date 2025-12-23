import { Schema, model, Document, Types } from "mongoose";

interface IAnswer {
  questionId: Types.ObjectId;
  answer: string;
}

interface IUserCheckIns {
  user: Types.ObjectId;
  version: number;
  answers: IAnswer[];
}

const UserCheckInsSchema = new Schema<IUserCheckIns>(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    version: {
      type: Number,
      required: true,
    },
    answers: [
      {
        questionId: {
          type: Types.ObjectId,
          ref: "CheckInQuestion",
        },
        type: {
          type: String,
          enum: ["rating", "text"],
        },
        answer: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserCheckIns = model<IUserCheckIns>("UserCheckIn", UserCheckInsSchema);

export default UserCheckIns;
