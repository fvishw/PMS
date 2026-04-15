import z from "zod";

const userAddPayloadSchema = z.object({
  fullName: z.string().min(1, "Full name cannot be empty"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  joiningDate: z
    .string()
    .min(1, "Joining date is required")
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      "Invalid joining date",
    ),
  role: z.enum(["employee", "manager", "admin"], {
    message: "Role must be employee, manager, or admin",
  }),
  designationId: z.string().min(1, "Designation ID cannot be empty"),
  parentReviewerId: z.string().optional(),
  adminReviewerId: z.string().optional(),
});

const userUpdatePayloadSchema = userAddPayloadSchema.omit({ email: true });

export { userAddPayloadSchema, userUpdatePayloadSchema };
