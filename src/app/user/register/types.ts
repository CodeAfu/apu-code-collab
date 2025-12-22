import { z } from "zod";

const passwordMessage = "Password must contain atleast 8 characters";

export const registerSchema = z.object({
  apuId: z.string().regex(/^T[PC]\d{6}$/, "Please enter a valid TP number"),
  password: z.string().min(1, passwordMessage),
  rePassword: z.string().min(1, passwordMessage),
  email: z.email().optional().or(z.literal("")),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  // role: z.enum(["student", "teacher"], "Please select an option"),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
