import axios from "axios";
import { LoginFormType, LoginResponse } from "@/app/user/login/types";
import { API_BASE_URL } from "@/lib/consts";
import { AuthError } from "@/lib/types";
import { Token } from "@/types/auth";

const login = async (data: LoginFormType): Promise<LoginResponse> => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/auth/token`,
    new URLSearchParams({
      username: data.email,
      password: data.password,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );
  return response.data;
};

export const loginQuery = (setToken: (token: Token) => void) => ({
  mutationFn: login,
  onSuccess: (data: LoginResponse) => {
    setToken(data);
  },
  onError: (error: unknown) => {
    if (axios.isAxiosError<AuthError>(error) && error.response?.data?.detail) {
      console.error(error.response.data.detail.message);
    }
  },
});
