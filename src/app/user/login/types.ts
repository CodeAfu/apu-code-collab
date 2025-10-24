import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
