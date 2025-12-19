import type { Request, Response } from "express";
import { CheckIns } from "../models/checkIns.model.ts";
import { CheckInQuestionsPayload, CheckInsPayload } from "../types/checkIns.ts";
import { ApiError } from "../utils/ApiError.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { CheckInsQuestions } from "../models/question.model.ts";

const addCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const { checkIns } = req.body;
  const userId = req.user?.id!;

  const parsedCheckIn = JSON.parse(checkIns);
  console.log(parsedCheckIn["1"]);

  const parsedCheckIns = CheckInsPayload.safeParse(parsedCheckIn);

  if (parsedCheckIns.success === false) {
    throw new ApiError(400, "Invalid checkIns payload");
  }

  const validCheckIns = parsedCheckIns.data;

  const employeeCheckIns = new CheckIns({
    employeeId: userId,
    date: new Date(),
    responses: validCheckIns,
  });

  await employeeCheckIns.save();

  return res
    .status(201)
    .json(new ApiError(201, "Check-ins added successfully"));
});

const addCheckInsQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { checkInsQuestions } = req.body;

    const parsedCheckInsQuestions =
      CheckInQuestionsPayload. safeParse(checkInsQuestions);

    if (parsedCheckInsQuestions.success === false) {
      throw new ApiError(400, "Invalid checkInsQuestions payload");
    }
    const validCheckInsQuestions = parsedCheckInsQuestions.data;

    const employeeCheckInsQuestions = await CheckInsQuestions.insertMany(
      validCheckInsQuestions
    );

    return res
      .status(201)
      .json(new ApiError(201, "Check-in questions added successfully"));
  }
);

export { addCheckIns, addCheckInsQuestions };
