import axios from "axios";
import { RegisterFormType } from "./types";
import { API_BASE_URL } from "@/lib/consts";
import { AuthError } from "@/types/auth";
import { UseMutationOptions } from "@tanstack/react-query";

const register = async (data: RegisterFormType): Promise<boolean> => {
  const response = await axios.post<boolean | null>(
    `${API_BASE_URL}/api/v1/auth/register`,
    {
      first_name: data.firstName,
      last_name: data.lastName,
      apu_id: data.apuId,
      email: data.email,
      password: data.password,
      role: data.role,
      is_active: true,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );
  return response.data ?? false;
};

export const registerQuery = (): UseMutationOptions<
  boolean,
  Error,
  RegisterFormType
> => ({
  mutationFn: register,
  onSuccess: () => {
    console.log("User registered successfully!");
  },
  onError: (error: unknown) => {
    if (axios.isAxiosError<AuthError>(error) && error.response?.data?.detail) {
      console.error(error.response.data.detail.message);
    }
  },
});
