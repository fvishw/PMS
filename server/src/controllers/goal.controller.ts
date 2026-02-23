import Goal from "@/models/goal.model.js";
import Settings from "@/models/settings.model.js";
import {
  GoalSchema,
  markAsCompletedSchema,
  updateGoalSchema,
} from "@/types/goal.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";
import { Types } from "mongoose";

const addGoal = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = GoalSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid Goal Payload");
  }
  const today = new Date();
  if (parsedPayload.data.dueDate < today) {
    throw new ApiError(400, "Due date cannot be in the past.");
  }

  const { currentQuarter, currentYear } =
    await Settings.getCurrentYearAndQuarter();
  const { title, subTasks, owner, dueDate } = parsedPayload.data;
  const userGoal = new Goal({
    title,
    subTasks,
    owner,
    dueDate,
    quarter: currentQuarter,
    year: currentYear,
  });
  await userGoal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Goal added successfully"));
});

const markAsComplete = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = markAsCompletedSchema.safeParse(req.body);

  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid Goal payload");
  }
  const { goalId, subTasks } = parsedPayload.data;

  const goal = await Goal.findById(goalId);

  if (!goal) {
    throw new ApiError(400, "Goal not Found");
  }
  const isDueDatePassed = goal.getDueDateDifference() < 0;

  if (isDueDatePassed) {
    throw new ApiError(400, "Cannot update goal after due date has passed.");
  }
  let totalCompleted = 0;

  subTasks.map((subTask) => {
    const userTask = goal.subTasks.find(
      (task) => String(task._id) === subTask._id.toString(),
    );
    if (userTask) {
      userTask.isCompleted = subTask.isCompleted;
      if (userTask.isCompleted) {
        totalCompleted++;
      }
    }
  });

  goal.isCompleted = totalCompleted === goal.subTasks.length;
  await goal.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Task Marks as Completed as Successfully"),
    );
});

const updateGoal = asyncHandler(async (req: Request, res: Response) => {
  const { goalId } = req.params;

  if (!goalId) {
    throw new ApiError(400, "Goal Id not found.");
  }
  if (!Types.ObjectId.isValid(goalId)) {
    throw new ApiError(400, "Invalid Goal Id format.");
  }

  const parsedPayload = updateGoalSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid Goal Payload");
  }

  const goal = await Goal.findOne({ _id: goalId, isDeleted: false });
  if (!goal) {
    throw new ApiError(404, "Goal with given id not found");
  }

  const { title, owner, dueDate, subTasks } = parsedPayload.data;
  const ownerId = typeof owner === "string" ? owner : owner._id;
  if (!Types.ObjectId.isValid(ownerId)) {
    throw new ApiError(400, "Invalid owner id format.");
  }

  const existingSubTasksMap = new Map(
    goal.subTasks.map((task) => [String(task._id), task.isCompleted]),
  );

  goal.title = title;
  goal.owner = new Types.ObjectId(ownerId);
  goal.dueDate = dueDate;
  goal.subTasks = subTasks.map((task) => ({
    title: task.title,
    isCompleted: task._id
      ? Boolean(existingSubTasksMap.get(String(task._id)))
      : false,
  }));

  await goal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Goal updated successfully"));
});

const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
  const { goalId } = req.query;
  if (!goalId) {
    throw new ApiError(400, "Goal Id not found.");
  }
  if (!Types.ObjectId.isValid(goalId as string)) {
    throw new ApiError(400, "Invalid Goal Id format.");
  }

  const goal = await Goal.findByIdAndUpdate(
    goalId,
    { isDeleted: true },
    { new: true },
  );

  if (!goal) {
    throw new ApiError(404, "Goal with given id not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Goal deleted successfully"));
});

const getAllGoals = asyncHandler(async (req: Request, res: Response) => {
  const { userId, quarter, year } = req.query;
  const filter: Record<string, unknown> = { isDeleted: false };
  if (userId && userId !== "ALL") {
    filter.owner = userId;
  }
  if (quarter) {
    filter.quarter = quarter;
  }
  if (year) {
    filter.year = Number(year);
  }
  const goals = await Goal.find(filter).populate({
    path: "owner",
    select: "fullName",
  });

  const formattedGoals = goals.map((goal) => ({
    ...goal.toObject(),
    status: goal.getStatus(),
    owner: goal.owner ? (goal.owner as any).fullName : "Unknown",
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { goals: formattedGoals },
        "Goals fetched successfully",
      ),
    );
});

const getGoalById = asyncHandler(async (req: Request, res: Response) => {
  const { goalId } = req.params;
  if (!goalId) {
    throw new ApiError(400, "Goal Id not found.");
  }

  const goal = await Goal.findOne({ _id: goalId, isDeleted: false });

  if (!goal) {
    throw new ApiError(404, "Goal with given id not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { goal }, "Goal fetched successfully"));
});

const getGoalsByOwner = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "User Id not found.");
  }

  const goals = await Goal.find({ owner: userId, isDeleted: false }).populate(
    "owner",
    "fullName",
  );

  return res
    .status(200)
    .json(new ApiResponse(200, { goals }, "Goals fetched successfully"));
});

export {
  addGoal,
  updateGoal,
  markAsComplete,
  deleteGoal,
  getAllGoals,
  getGoalById,
  getGoalsByOwner,
};
