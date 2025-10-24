import z from "zod";

const passwordMessage = "Password must contain atleast 8 characters";

export const registerSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name"),
  lastName: z.string().min(1, "Please enter your last name"),
  apuId: z.string().regex(/^T[PC]\d{6}$/, "Please enter a valid TP number"),
  email: z.email(),
  password: z.string().min(1, passwordMessage),
  role: z.enum(["student", "teacher"], "Please select an option"),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
