import Goal from "@/models/goal.model.js";
import { GoalSchema, markAsCompletedSchema } from "@/types/goal.js";
import { ApiError } from "@/utils/ApiError.js";
import { ApiResponse } from "@/utils/ApiResponse.js";
import asyncHandler from "@/utils/asyncHandler.js";
import type { Request, Response } from "express";

const addGoal = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = GoalSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid Goal Payload");
  }
  const { title, subTasks, owner, dueDate } = parsedPayload.data;
  const userGoal = new Goal({
    title,
    subTasks,
    owner,
    dueDate,
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

  subTasks.map((subTask) => {
    const userTask = goal.subTasks.find(
      (task) => String(task._id) === subTask._id.toString(),
    );
    if (userTask) {
      userTask.isCompleted = subTask.isCompleted;
    }
  });

  await goal.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, null, "Task Marks as Completed as Successfully"),
    );
});

const deleteGoal = asyncHandler(async (req: Request, res: Response) => {
  const { goalId } = req.query;
  if (!goalId) {
    throw new ApiError(400, "Goal Id not found.");
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
  const goals = await Goal.find({ isDeleted: false }).populate(
    "owner",
    "fullName",
  );
  return res
    .status(200)
    .json(new ApiResponse(200, { goals }, "Goals fetched successfully"));
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
  markAsComplete,
  deleteGoal,
  getAllGoals,
  getGoalById,
  getGoalsByOwner,
};
