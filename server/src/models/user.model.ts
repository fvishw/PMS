import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import AuthService from "../utils/AuthService.ts";
export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin" | "user" | "manager";
  createdAt: Date;
  updatedAt: Date;
  isSignUpComplete?: boolean;
  refreshToken: string;
  comparePassword(password: string): boolean;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "manager"] },
    isSignUpComplete: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
  }
});
UserSchema.method("comparePassword", function (password: string) {
  return bcrypt.compareSync(password, this.password);
});
UserSchema.method("generateAuthToken", function () {
  return AuthService.generateAccessToken(this._id, this.role, this.email);
});
UserSchema.method("generateRefreshToken", function () {
  return AuthService.generateRefreshToken(this._id, this.email);
});

export const User = model<IUser>("User", UserSchema);
