import { Schema, model, Document, Types } from "mongoose";

interface IAnswer {
  questionId: Types.ObjectId;
  answer: string;
}

interface IUserCheckIns {
  user: Types.ObjectId;
  version: string;
  answers: IAnswer[];
  createdAt?: Date;
}

const UserCheckInsSchema = new Schema<IUserCheckIns>({
  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  version: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserCheckIns = model<IUserCheckIns>("UserCheckIn", UserCheckInsSchema);

export default UserCheckIns;
