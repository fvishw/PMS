import z from "zod";

const userAddPayloadSchema = z.object({
  fullName: z.string().min(1, "Full name cannot be empty"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["employee", "manager", "admin"], {
    message: "Role must be employee, manager, or admin",
  }),
  designationId: z.string().min(1, "Designation ID cannot be empty"),
  parentReviewerId: z.string().optional(),
  adminReviewerId: z.string().optional(),
});

export { userAddPayloadSchema };
