"use client";

import axios from "axios";
import z from "zod";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/consts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AuthError } from "@/lib/types";
import { useSetAuthToken } from "@/stores/auth-store";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type LoginForm = z.infer<typeof loginSchema>;

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

const login = async (data: LoginForm): Promise<LoginResponse> => {
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

interface LoginFormProps {
  closeModal?: () => void;
}

export default function LoginForm({ closeModal }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });
  const setToken = useSetAuthToken();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data);
      if (closeModal) closeModal();
    },
    onError: (error) => {
      if (
        axios.isAxiosError<AuthError>(error) &&
        error.response?.data?.detail
      ) {
        console.error(error.response.data.detail.message);
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutate(data);
  };

  const getErrorMessage = () => {
    if (axios.isAxiosError<AuthError>(error) && error.response?.data?.detail) {
      return error.response.data.detail.message;
    }
    return "Login failed";
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="mb-8 flex flex-col gap-2">
        <div>
          <label className="text-sm" htmlFor="login_email_field">
            Email:
          </label>
          <Input
            id="login_email_field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm" htmlFor="login_password_field">
            Password:
          </label>
          <Input
            id="login_password_field"
            type="password"
            className="py-1 text-sm sm:text-base rounded"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? "Loading..." : "Login"}
      </Button>
      {isError && (
        <p className="text-red-500 text-sm sm:text-base mt-2">
          {getErrorMessage()}
        </p>
      )}
    </form>
  );
}
