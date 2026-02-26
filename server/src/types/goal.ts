import z from "zod";

const subTask = z.object({
  title: z.string(),
});

const GoalSchema = z.object({
  title: z.string(),
  subTasks: z.array(subTask),
  owner: z.string(),
  dueDate: z.coerce.date(),
});

const updateGoalSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  subTasks: z.array(
    z.object({
      _id: z.string().optional(),
      title: z.string(),
    }),
  ),
  owner: z.union([
    z.string(),
    z.object({
      _id: z.string(),
    }),
  ]),
  dueDate: z.coerce.date(),
});

const markAsCompletedSchema = z.object({
  goalId: z.string(),
  subTasks: z.array(
    z.object({
      _id: z.string(),
      isCompleted: z.boolean(),
    }),
  ),
});

export { GoalSchema, updateGoalSchema, markAsCompletedSchema };
