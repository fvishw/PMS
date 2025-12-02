import { Schema, model, Document } from "mongoose";

interface IDesignation extends Document {
  name: string;
  description: string;
}

const DesignationSchema = new Schema<IDesignation>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Designation = model<IDesignation>(
  "Designation",
  DesignationSchema
);
