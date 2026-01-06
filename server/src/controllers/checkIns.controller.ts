import type { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { QuestionsPayload, AnswerPayload } from "../types/checkIns.ts";
import { ApiError } from "../utils/ApiError.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import {
  CheckInQuestions,
  type ICheckInQuestion,
} from "../models/question.model.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import type { IUser } from "../models/user.model.ts";
import UserCheckIns from "../models/userCheckIns.model.ts";

const addCheckIns = asyncHandler(async (req: Request, res: Response) => {
  const { checkIns } = req.body;
  const userId = req.user?.id!;

  const parsedCheckIns = AnswerPayload.safeParse(checkIns);

  if (parsedCheckIns.success === false) {
    throw new ApiError(400, "Invalid checkIns payload");
  }
  const { answers, version } = parsedCheckIns.data;

  const convertedAnswers = answers.map((answer) => ({
    questionId: new Types.ObjectId(answer.questionId),
    answer: answer.answer,
  }));

  await UserCheckIns.create({
    user: userId,
    version: version,
    answers: convertedAnswers,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, null, "Check-ins added successfully"));
});

const addCheckInQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const { checkInQuestions } = req.body;

    const parsedCheckInQuestions = QuestionsPayload.safeParse(checkInQuestions);

    if (parsedCheckInQuestions.success === false) {
      throw new ApiError(400, "Invalid checkInQuestions payload");
    }
    const { questions, version } = parsedCheckInQuestions.data;

    const isVersionExists = await CheckInQuestions.findOne({
      version: version,
    });

    if (isVersionExists) {
      throw new ApiError(400, "Version already exists");
    }

    const questionsToInsert = questions.map((question) => ({
      question: question.question,
      type: question.type,
      version: version,
      isActive: false,
    }));

    await CheckInQuestions.insertMany(questionsToInsert);

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

  const checkInQuestion = await CheckInQuestions.find({
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
      _id: (item.questionId as any)._id,
      question: (item.questionId as any)?.question as string,
      answer: item.answer,
      type: (item.questionId as any)?.type as string,
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
    name: (checkIn.user as unknown as IUser).fullName,
    email: (checkIn.user as unknown as IUser).email,
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
  const { checkInId } = req.params;

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
      question: (item.questionId as any)?.question as string,
      answer: item.answer,
      type: (item.questionId as any)?.type as string,
    })),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, flattenedCheckIns, "Past Check-ins fetched"));
});

const getAllCheckInQuestions = asyncHandler(
  async (req: Request, res: Response) => {
    const checkInQuestions = await CheckInQuestions.aggregate([
      {
        $group: {
          _id: "$version",
          createdAt: { $first: "$createdAt" },
          isActive: { $first: "$isActive" },
        },
      },
      {
        $project: {
          _id: 0,
          version: "$_id",
          createdAt: 1,
          isActive: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { questionSet: checkInQuestions },
          "Check-in questions fetched"
        )
      );
  }
);

const activateQuestionSet = asyncHandler(
  async (req: Request, res: Response) => {
    const { version } = req.body;
    if (!version || typeof version !== "string") {
      throw new ApiError(400, "Invalid or missing version parameter");
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await CheckInQuestions.updateMany(
        { isActive: true },
        { $set: { isActive: false } }
      );

      await CheckInQuestions.updateMany(
        { version: version },
        { $set: { isActive: true } }
      );
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Question set activated"));
  }
);

const getAllCheckInQuestionsByVersion = asyncHandler(
  async (req: Request, res: Response) => {
    const { version } = req.query;

    if (!version || typeof version !== "string") {
      throw new ApiError(400, "Invalid or missing version parameter");
    }

    const checkInQuestions = await CheckInQuestions.aggregate([
      { $match: { version: version } },
      {
        $group: {
          _id: "$version",
          questionSet: {
            $push: { question: "$question", type: "$type", _id: "$_id" },
          },
          createdAt: { $first: "$createdAt" },
          isActive: { $first: "$isActive" },
        },
      },
      {
        $project: {
          _id: 0,
          version: "$_id",
          questionSet: 1,
          createdAt: 1,
          isActive: 1,
        },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(200, checkInQuestions[0], "Check-in questions fetched")
      );
  }
);

export {
  addCheckIns,
  addCheckInQuestions,
  getCheckIns,
  getPastCheckIns,
  getAllUserCheckIns,
  getUserCheckInById,
  getAllCheckInQuestions,
  activateQuestionSet,
  getAllCheckInQuestionsByVersion,
};
