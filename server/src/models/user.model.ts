import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import AuthService from "../utils/AuthService.ts";

interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "admin" | "employee" | "manager";
  designation: Types.ObjectId;
  parentReviewer?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isSignUpComplete?: boolean;
  refreshToken: string;
  passwordResetToken?: string | null;
  postPasswordResetCleanup(): void;
  comparePassword(password: string): boolean;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "employee", "manager"],
      default: "employee",
      required: true,
    },
    designation: {
      type: Schema.Types.ObjectId,
      ref: "Designation",
    },
    parentReviewer: { type: Schema.Types.ObjectId, ref: "User" },
    isSignUpComplete: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
    passwordResetToken: { type: String, default: null },
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
UserSchema.method("postPasswordResetCleanup", function () {
  this.passwordResetToken = null;
});

export const User = model<IUser>("User", UserSchema);
export { type IUser };
