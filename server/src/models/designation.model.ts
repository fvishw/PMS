import { Schema, model, Document } from "mongoose";

interface IDesignation extends Document {
  title: string;
  description: string;
}

const DesignationSchema = new Schema<IDesignation>(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Designation = model<IDesignation>(
  "Designation",
  DesignationSchema
);
