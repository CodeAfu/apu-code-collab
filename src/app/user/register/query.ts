import { RegisterFormType } from "./types";
import { UseMutationOptions } from "@tanstack/react-query";
import { logApiErr } from "@/lib/utils";
import api from "@/lib/api";

const register = async (data: RegisterFormType) => {
  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    apu_id: data.apuId,
    email: data.email,
    password: data.password,
    role: data.role,
    is_active: true,
  }

  const response = await api.post(`/api/v1/auth/register`, payload);
  return response.data;
};

export const registerMutationOptions = (): UseMutationOptions<
  boolean,
  Error,
  RegisterFormType
> => ({
  mutationFn: register,
  onSuccess: (data) => {
    console.log("User registered:", data);
  },
  onError: (error) => {
    logApiErr(error);
  },
});
