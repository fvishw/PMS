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

const markAsCompletedSchema = z.object({
  goalId: z.string(),
  subTasks: z.array(
    z.object({
      _id: z.string(),
      isCompleted: z.boolean(),
    })
  ),
});

export { GoalSchema, markAsCompletedSchema };
