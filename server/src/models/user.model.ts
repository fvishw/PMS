import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user" | "manager";
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "manager"], required: true },
    status: { type: String, enum: ["active", "inactive"], required: true },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }
});

export const User = model<IUser>("User", UserSchema);
