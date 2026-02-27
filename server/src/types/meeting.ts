import z from "zod";

const MeetingSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  employee: z.string().min(1, "Employee is required"),
  meetingDate: z.coerce.date(),
  notes: z.string().optional().default(""),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
});

const UpdateMeetingSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
  meetingDate: z.coerce.date().optional(),
  notes: z.string().optional(),
  status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
});

export { MeetingSchema, UpdateMeetingSchema };
