import z, { number } from "zod";

const Question = z.object({
  type: z.enum(["rating", "text"]),
  question: z.string().min(1, "Question cannot be empty"),
});

const QuestionsPayload = z.object({
  questions: z.array(Question).min(1, "At least one question is required"),
  version: z.number().min(1),
  isActive: z.boolean(),
});

const AnswerPayload = z.object({
  version: z.number().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().min(1, "questionId cannot be empty"),
      answer: z.string().min(1, "Answer cannot be empty"),
    })
  ),
});

export { QuestionsPayload, AnswerPayload };
