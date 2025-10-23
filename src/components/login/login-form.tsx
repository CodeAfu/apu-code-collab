"use client";

import axios from "axios";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/lib/consts";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";

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
  const response = await axios.post(`${API_BASE_URL}/api/v1/auth/token`, data);
  return response.data;
};

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data) {
        const detail = error.response.data.detail;
        console.error(detail.message);
      }
    },
  });

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data);
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold mb-2">Login</h1>
      <div className="mb-4 flex flex-col gap-2">
        <div>
          <label className="text-sm" htmlFor="login_email_field">
            Email:
          </label>
          <Input
            id="login_email_field"
            className="py-1 text-sm rounded"
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
            className="py-1 text-sm rounded"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Loading..." : "Login"}
      </Button>
      {mutation.isError && (
        <p className="text-red-500 text-sm mt-2">{mutation.error.message}</p>
      )}
    </form>
  );
}
