import { Schema, model, Document } from "mongoose";

interface IDesignation extends Document {
  role: "employee" | "manager" | "admin";
  title: string;
}

const DesignationSchema = new Schema<IDesignation>(
  {
    role: {
      type: String,
      enum: ["employee", "manager", "admin"],
      required: true,
    },
    title: { type: String, required: true },
  },
  { timestamps: true }
);

export const Designation = model<IDesignation>(
  "Designation",
  DesignationSchema
);
