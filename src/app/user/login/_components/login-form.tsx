"use client";

import axios from "axios";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSetAuthToken } from "@/stores/auth-store";
import { loginQuery } from "@/app/user/login/query";
import { loginSchema, LoginFormType } from "../types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useIsLoggedIn } from "@/hooks/use-is-logged-in";
import { AuthError } from "@/types/auth";

export default function LoginForm() {
  const loggedIn = useIsLoggedIn();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    if (loggedIn) router.push(redirectTo);
  }, [loggedIn, router, redirectTo]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
  });
  const setToken = useSetAuthToken();

  const {
    mutate: handleLogin,
    isPending,
    isError,
    error: queryError,
  } = useMutation(loginQuery(setToken));

  const onSubmit = (data: LoginFormType) => {
    handleLogin(data);
  };

  const getErrorMessage = () => {
    if (
      axios.isAxiosError<AuthError>(queryError) &&
      queryError.response?.data?.detail
    ) {
      return queryError.response.data.detail.message;
    }
    return "Login failed";
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="mb-8 flex flex-col gap-2">
        <div>
          <label className="text-sm" htmlFor="email-field">
            Email:
          </label>
          <Input
            id="email-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm" htmlFor="password-field">
            Password:
          </label>
          <Input
            id="password-field"
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
        <p className="text-red-500 text-sm mt-2">
          {getErrorMessage()}
        </p>
      )}
    </form>
  );
}
