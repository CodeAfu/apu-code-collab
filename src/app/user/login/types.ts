import { z } from "zod";

export const loginSchema = z.object({
  tpNumber: z.string().min(1, "TP Number required"),
  password: z.string().min(1, "Password required"),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export interface LoginResponse {
  access_token: string;
  token_type: string;
}
