import Meeting from "@/models/meeting.model.js";
import Settings from "@/models/settings.model.js";
import { MeetingSchema, UpdateMeetingSchema } from "@/types/meeting.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";
import { Types } from "mongoose";

const createMeeting = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = MeetingSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid meeting payload");
  }

  const adminId = req.user?.id;
  if (!adminId) {
    throw new ApiError(401, "Unauthorized");
  }

  const { employee } = parsedPayload.data;
  if (!Types.ObjectId.isValid(employee)) {
    throw new ApiError(400, "Invalid employee ID");
  }

  const { currentQuarter, currentYear } =
    await Settings.getCurrentYearAndQuarter();

  const meeting = new Meeting({
    ...parsedPayload.data,
    admin: adminId,
    quarter: currentQuarter,
    year: currentYear,
  });

  await meeting.save();

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Meeting created successfully"));
});

const updateMeeting = asyncHandler(async (req: Request, res: Response) => {
  const { meetingId } = req.params;

  if (!meetingId || !Types.ObjectId.isValid(meetingId)) {
    throw new ApiError(400, "Invalid meeting ID");
  }

  const parsedPayload = UpdateMeetingSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid meeting payload");
  }

  const meeting = await Meeting.findOne({ _id: meetingId, isDeleted: false });
  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  const { title, meetingDate, notes, status } = parsedPayload.data;
  if (title !== undefined) meeting.title = title;
  if (meetingDate !== undefined) meeting.meetingDate = meetingDate;
  if (notes !== undefined) meeting.notes = notes;
  if (status !== undefined) meeting.status = status;

  await meeting.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Meeting updated successfully"));
});

const deleteMeeting = asyncHandler(async (req: Request, res: Response) => {
  const { meetingId } = req.query;

  if (!meetingId || !Types.ObjectId.isValid(meetingId as string)) {
    throw new ApiError(400, "Invalid meeting ID");
  }

  const meeting = await Meeting.findByIdAndUpdate(
    meetingId,
    { isDeleted: true },
    { new: true },
  );

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Meeting deleted successfully"));
});

const getAllMeetings = asyncHandler(async (req: Request, res: Response) => {
  const { employeeId, quarter, year, status } = req.query;
  const filter: Record<string, unknown> = { isDeleted: false };

  if (employeeId && employeeId !== "ALL") {
    filter.employee = employeeId;
  }
  if (quarter) {
    filter.quarter = quarter;
  }
  if (year) {
    filter.year = Number(year);
  }
  if (status && status !== "ALL") {
    filter.status = status;
  }

  const meetings = await Meeting.find(filter)
    .populate({ path: "employee", select: "fullName email" })
    .populate({ path: "admin", select: "fullName" })
    .sort({ meetingDate: -1 });

  const formattedMeetings = meetings.map((meeting) => ({
    ...meeting.toObject(),
    employeeName: meeting.employee
      ? (meeting.employee as any).fullName
      : "Unknown",
    adminName: meeting.admin ? (meeting.admin as any).fullName : "Unknown",
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { meetings: formattedMeetings },
        "Meetings fetched successfully",
      ),
    );
});

const getMeetingById = asyncHandler(async (req: Request, res: Response) => {
  const { meetingId } = req.params;

  if (!meetingId || !Types.ObjectId.isValid(meetingId)) {
    throw new ApiError(400, "Invalid meeting ID");
  }

  const meeting = await Meeting.findOne({ _id: meetingId, isDeleted: false })
    .populate({ path: "employee", select: "fullName email" })
    .populate({ path: "admin", select: "fullName" });

  if (!meeting) {
    throw new ApiError(404, "Meeting not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { meeting }, "Meeting fetched successfully"),
    );
});

export {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getAllMeetings,
  getMeetingById,
};
