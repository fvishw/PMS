import z, { number } from "zod";

const Question = z.object({
  key: z.string().min(1, "Key cannot be empty"),
  question: z.string().min(1, "Question cannot be empty"),
  type: z.enum(["rating", "text"]),
  version: z.number().min(1),
  isActive: z.boolean(),
});

const CheckIn = z.object({
  questionId: z.string().min(1, "Question cannot be empty"),
  type: z.enum(["rating", "text"]),
  answer: z.string().min(1, "Answer cannot be empty"),
  questionVersion: z.number().min(1),
});

export const CheckInsPayload = z.record(z.string(), CheckIn);
export const CheckInQuestionsPayload = z.array(Question);
