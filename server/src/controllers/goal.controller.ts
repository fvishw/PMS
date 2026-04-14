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
import { getPaginationMeta, getPaginationParams } from "@/utils/pagination.js";

const isGoalCompletedFromSubTasks = (
  subTasks: { isCompleted: boolean }[],
): boolean => subTasks.length > 0 && subTasks.every((task) => task.isCompleted);

const toLocalDateStart = (value: unknown): Date => {
  if (typeof value === "string") {
    const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})(?:$|T)/);
    if (dateOnlyMatch) {
      const [, year, month, day] = dateOnlyMatch;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const parsedDate = value instanceof Date ? value : new Date(String(value));
  return new Date(
    parsedDate.getFullYear(),
    parsedDate.getMonth(),
    parsedDate.getDate(),
  );
};

const ensureDueDateIsTodayOrFuture = (dueDate: unknown): void => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDateForValidation = toLocalDateStart(dueDate);
  if (dueDateForValidation < today) {
    throw new ApiError(400, "Due date cannot be in the past.");
  }
};

const addGoal = asyncHandler(async (req: Request, res: Response) => {
  const parsedPayload = GoalSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    throw new ApiError(400, "Invalid Goal Payload");
  }
  ensureDueDateIsTodayOrFuture(req.body?.dueDate ?? parsedPayload.data.dueDate);

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
  subTasks.forEach((subTask) => {
    const userTask = goal.subTasks.find(
      (task) => String(task._id) === subTask._id.toString(),
    );
    if (userTask) {
      userTask.isCompleted = subTask.isCompleted;
    }
  });

  goal.isCompleted = isGoalCompletedFromSubTasks(goal.subTasks);
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
  ensureDueDateIsTodayOrFuture(req.body?.dueDate ?? parsedPayload.data.dueDate);

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
  const normalizedSubTasks: {
    _id: Types.ObjectId;
    title: string;
    isCompleted: boolean;
  }[] = subTasks.map((task) => {
    if (task._id && !Types.ObjectId.isValid(task._id)) {
      throw new ApiError(400, "Invalid subtask id format.");
    }

    const subTaskId = task._id
      ? new Types.ObjectId(task._id)
      : new Types.ObjectId();

    return {
      _id: subTaskId,
      title: task.title,
      isCompleted: task._id ? Boolean(existingSubTasksMap.get(task._id)) : false,
    };
  });
  goal.subTasks = normalizedSubTasks;
  goal.isCompleted = isGoalCompletedFromSubTasks(goal.subTasks);

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
  const { page, limit, skip } = getPaginationParams(req.query);
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
  const [goals, totalItems, allMatchingGoals] = await Promise.all([
    Goal.find(filter)
      .populate({
        path: "owner",
        select: "fullName",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Goal.countDocuments(filter),
    Goal.find(filter),
  ]);

  const stats = {
    notStartedGoals: 0,
    completedGoals: 0,
    atRiskGoals: 0,
    onTrackGoals: 0,
    incompleteGoals: 0,
  };

  allMatchingGoals.forEach((goal) => {
    const status = goal.getStatus();

    if (status === "completed") {
      stats.completedGoals += 1;
    } else if (status === "not_started") {
      stats.notStartedGoals += 1;
    } else if (status === "at_risk") {
      stats.atRiskGoals += 1;
    } else if (status === "incomplete") {
      stats.incompleteGoals += 1;
    } else if (status === "on_track") {
      stats.onTrackGoals += 1;
    }
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
        {
          goals: formattedGoals,
          stats,
          pagination: getPaginationMeta({ totalItems, page, limit }),
        },
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
