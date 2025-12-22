import { Schema, model, Document, Types } from "mongoose";
import type { IMasterCompetency } from "./masterCompetency.model.ts";

interface IUserCompetency extends IMasterCompetency {
  user: Types.ObjectId;
}

const UserCompetencySchema = new Schema<IUserCompetency>({
  user: { type: Types.ObjectId, ref: "User" },
  designation: {
    type: Types.ObjectId,
    ref: "Designation",
    required: true,
    unique: true,
  },
  competencies: [
    {
      title: String,
      indicators: [{ type: String }],
      score: { type: Number },
    },
  ],
});
const UserCompetency = model<IUserCompetency>(
  "UserCompetency",
  UserCompetencySchema
);

export default UserCompetency;
