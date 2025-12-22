import { Schema, model, Document, Types } from "mongoose";

interface ICompetency {
  title: string;
  indicators: string[];
  score: number;
}

interface IMasterCompetency extends Document {
  designation: Types.ObjectId;
  competencies: ICompetency[];
}

const MasterCompetencySchema = new Schema<IMasterCompetency>({
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

const MasterCompetency = model<IMasterCompetency>(
  "MasterCompetency",
  MasterCompetencySchema
);

export default MasterCompetency;

export { type IMasterCompetency };
