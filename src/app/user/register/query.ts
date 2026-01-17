import { RegisterFormType } from "./types";
import { UseMutationOptions } from "@tanstack/react-query";
import { devLog, jsonLog, logApiError } from "@/lib/utils";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const register = async (data: RegisterFormType) => {
  if (data.password !== data.rePassword) {
    throw new Error("Passwords do not match");
  }
  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    apu_id: data.apuId,
    email: data.email,
    password: data.password,
  }
  jsonLog(data)
  const response = await api.post(`/api/v1/auth/register`, payload);
  return response.data;
};

type AppRouterInstance = ReturnType<typeof useRouter>;
export const registerMutationOptions = (router: AppRouterInstance): UseMutationOptions<
  boolean,
  Error,
  RegisterFormType
> => ({
  mutationFn: register,
  onSuccess: (data) => {
    devLog("User registered:", data);
    router.push("/user/login")
  },
  onError: (error) => {
    logApiError(error);
  },
});

