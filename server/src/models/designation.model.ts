import { Schema, model, Document } from "mongoose";

interface IDesignation extends Document {
  role: "employee" | "manager" | "admin";
  title: string;
  isActive: boolean;
}

const DesignationSchema = new Schema<IDesignation>(
  {
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      required: true,
    },
    title: { type: String, required: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Designation = model<IDesignation>(
  "Designation",
  DesignationSchema
);
