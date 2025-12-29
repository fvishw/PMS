import type { Request, Response } from "express";
import { Types } from "mongoose";
import { QuestionsPayload, AnswerPayload } from "../types/checkIns.ts";
import { ApiError } from "../utils/ApiError.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import { CheckInsQuestions } from "../models/question.model.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { User } from "../models/user.model.ts";
import UserCheckIns from "../models/userCheckIns.model.ts";

const addCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const { checkIns } = req.body;
  const userId = req.user?.id!;

  const parsedCheckIns = AnswerPayload.safeParse(checkIns);

  if (parsedCheckIns.success === false) {
    throw new ApiError(400, "Invalid checkIns payload");
  }
  const validCheckIns = parsedCheckIns.data.answers;

  const convertedAnswers = validCheckIns.map((answer) => ({
    questionId: new Types.ObjectId(answer.questionId),
    answer: answer.answer,
  }));

  const userCheckIn = await UserCheckIns.insertOne({
    user: userId,
    version: checkIns.version,
    answers: convertedAnswers,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, null, "Check-ins added successfully"));
});

const addCheckInsQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { checkInsQuestions } = req.body;

    const parsedCheckInsQuestions =
      QuestionsPayload.safeParse(checkInsQuestions);

    if (parsedCheckInsQuestions.success === false) {
      throw new ApiError(400, "Invalid checkInsQuestions payload");
    }
    const { questions, version } = parsedCheckInsQuestions.data;

    const isVersionExists = await CheckInsQuestions.findOne({
      version: version,
    });

    if (isVersionExists) {
      throw new ApiError(400, "Version already exists");
    }

    const questionsToInsert = questions.map((question) => ({
      question: question.question,
      type: question.type,
      version: version,
      isActive: true,
    }));

    const employeeCheckInsQuestions = await CheckInsQuestions.insertMany(
      questionsToInsert
    );

    return res
      .status(201)
      .json(
        new ApiResponse(201, null, "Check-in questions added successfully")
      );
  }
);

const getCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id!;

  const userCheckIns = await UserCheckIns.findOne({
    user: userId,
    createdAt: {
      $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    },
  });

  if (userCheckIns) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { questions: [] },
          "User has already submitted this month's check-ins"
        )
      );
  }

  const checkInQuestion = await CheckInsQuestions.find({
    isActive: true,
  }).select("-isActive -__v -createdAt ");

  return res
    .status(200)
    .json(
      new ApiResponse(200, { questions: checkInQuestion }, "Check-ins fetched")
    );
});

const getPastCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const { month, year } = req.query;
  const userId = req.user?.id!;

  const pastCheckIns = await UserCheckIns.find({
    user: userId,
    createdAt: {
      $gte: new Date(Number(year as string), Number(month as string) - 1, 1),
      $lt: new Date(Number(year as string), Number(month as string), 1),
    },
  })
    .populate("answers.questionId", "question type")
    .lean();

  const flattenedCheckIns = pastCheckIns.map((checkIn) => ({
    ...checkIn,
    answers: checkIn.answers.map((item) => ({
      _id: item.questionId._id,
      question: item.questionId?.question,
      answer: item.answer,
      type: item.questionId?.type,
    })),
  }));

  const result =
    flattenedCheckIns.length === 0
      ? {
          answers: [],
        }
      : flattenedCheckIns[0];

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Past Check-ins fetched"));
});

const getAllUserCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const userCheckIns = await UserCheckIns.find()
    .select("-answers")
    .populate("user", "fullName email ")
    .lean();

  const flattenedCheckIns = userCheckIns.map((checkIn) => ({
    _id: checkIn._id,
    user: checkIn.user._id,
    version: checkIn.version,
    createdAt: checkIn.createdAt,
    name: (checkIn.user as typeof User).fullName,
    email: (checkIn.user as typeof User).email,
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { checkIns: flattenedCheckIns },
        "User Check-ins fetched"
      )
    );
});

const getUserCheckInById = asyncHandler(async (req: Request, res: Response) => {
  const { checkInId } = req.query;

  if (!checkInId || typeof checkInId !== "string") {
    throw new ApiError(400, "Invalid or missing checkInId parameter");
  }

  const checkIn = await UserCheckIns.findById(checkInId)
    .populate("answers.questionId", "question type")
    .populate("user", "fullName email ")
    .lean();

  if (!checkIn) {
    throw new ApiError(404, "Check-in not found");
  }

  const flattenedCheckIns = {
    ...checkIn,
    answers: checkIn.answers.map((item) => ({
      _id: item.questionId._id,
      question: item.questionId?.question,
      answer: item.answer,
      type: item.questionId?.type,
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, flattenedCheckIns, "Past Check-ins fetched"));
});

export {
  addCheckIns,
  addCheckInsQuestions,
  getCheckIns,
  getPastCheckIns,
  getAllUserCheckIns,
  getUserCheckInById,
};
