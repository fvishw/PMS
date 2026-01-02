import z from "zod";

const userAddPayloadSchema = z.object({
  fullName: z.string().min(1, "Full name cannot be empty"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role cannot be empty"),
  designationId: z.string().min(1, "Designation ID cannot be empty"),
  parentReviewerId: z.string().optional(),
  adminReviewerId: z.string().optional(),
});

export { userAddPayloadSchema };
