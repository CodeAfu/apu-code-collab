import axios from "axios";
import { LoginFormType, LoginResponse } from "@/app/user/login/types";
import { API_BASE_URL } from "@/lib/consts";
import { Token } from "@/types/auth";
import { mutationOptions } from "@tanstack/react-query";
import { jsonLog, logApiErr } from "@/lib/utils";

const login = async (data: LoginFormType): Promise<LoginResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/auth/token`,
    new URLSearchParams({
      username: data.tpNumber,
      password: data.password,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      withCredentials: true,
    }
  );
  return response.data;
};

export const loginMutationOptions = (
  setToken: (token: Token) => void
) => mutationOptions({
  mutationFn: login,
  onSuccess: (data: LoginResponse) => {
    setToken(data);
  },
  onError: (error) => {
    if (axios.isAxiosError(error)) {
      jsonLog(error.response?.data.detail)
      logApiErr(error);
    }
  },
});
