import "dotenv/config";
import mongoose, { Types } from "mongoose";

import { connectDB } from "../config/db.js";
import { Designation } from "../models/designation.model.js";
import { User } from "../models/user.model.js";
const ADMIN_DESIGNATION_TITLE =
  process.env.ADMIN_DESIGNATION_TITLE?.trim() || "Admin";

const ADMIN_FULL_NAME = process.env.ADMIN_FULL_NAME?.trim() || "Admin User";
const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL?.trim().toLowerCase() || "admin@example.com";
const ADMIN_PHONE_NUMBER =
  process.env.ADMIN_PHONE_NUMBER?.trim() || "9999999999";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || "Admin@123";
const ADMIN_JOINING_DATE =
  process.env.ADMIN_JOINING_DATE?.trim() || new Date().toISOString();

const ensureAdminDesignation = async () => {
  const existingDesignation = await Designation.findOne({
    role: "admin",
    title: { $regex: `^${ADMIN_DESIGNATION_TITLE}$`, $options: "i" },
  });

  if (existingDesignation) {
    if (!existingDesignation.isActive) {
      existingDesignation.isActive = true;
      await existingDesignation.save();
      console.log("Reactivated existing admin designation.");
    }

    return existingDesignation;
  }

  const designation = await Designation.create({
    role: "admin",
    title: ADMIN_DESIGNATION_TITLE,
    isActive: true,
  });

  console.log("Admin designation seeded successfully.");
  return designation;
};

const seedAdminUser = async () => {
  const designation = await ensureAdminDesignation();

  const designationId = designation._id;

  const existingUser = await User.findOne({
    email: { $regex: `^${ADMIN_EMAIL}$`, $options: "i" },
  });

  if (existingUser) {
    let didUpdate = false;

    if (!existingUser.isActive) {
      existingUser.isActive = true;
      didUpdate = true;
    }

    if (!existingUser.isSignUpComplete) {
      existingUser.password = ADMIN_PASSWORD;
      existingUser.isSignUpComplete = true;
      didUpdate = true;
    }

    if (existingUser.role !== "admin") {
      existingUser.role = "admin";
      didUpdate = true;
    }

    if (existingUser.designation?.toString() !== designationId.toString()) {
      existingUser.designation = designationId;
      didUpdate = true;
    }

    if (!existingUser.parentReviewer) {
      existingUser.parentReviewer = existingUser._id as Types.ObjectId;
      didUpdate = true;
    }

    if (!existingUser.adminReviewer) {
      existingUser.adminReviewer = existingUser._id as Types.ObjectId;
      didUpdate = true;
    }

    if (didUpdate) {
      await existingUser.save();
      console.log("Updated existing admin user.");
      return;
    }

    console.log("Admin user already exists.");
    return;
  }

  const adminUserId = new Types.ObjectId();

  await User.create({
    _id: adminUserId,
    fullName: ADMIN_FULL_NAME,
    email: ADMIN_EMAIL,
    phoneNumber: ADMIN_PHONE_NUMBER,
    joiningDate: new Date(ADMIN_JOINING_DATE),
    password: ADMIN_PASSWORD,
    role: "admin",
    designation: designationId,
    parentReviewer: adminUserId,
    adminReviewer: adminUserId,
    isSignUpComplete: true,
    isActive: true,
  });

  console.log("Admin user seeded successfully.");
};

const run = async () => {
  try {
    await connectDB();
    await seedAdminUser();
  } catch (error) {
    console.error("Failed to seed admin user:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void run();
