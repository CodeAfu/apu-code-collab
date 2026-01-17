"use client";

import axios from "axios";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAuthToken } from "@/stores/auth-store";
import { loginMutationOptions } from "@/app/user/login/query";
import { loginSchema, LoginFormType } from "../types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/hooks/use-user";

export default function LoginForm() {
  const { isAuthenticated } = useUser();
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo")

  useEffect(() => {
    if (!isAuthenticated) return;
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.push("/")
    }
  }, [isAuthenticated, router, redirectTo]);

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
    error: loginError,
  } = useMutation(loginMutationOptions(setToken));

  const onSubmit = (data: LoginFormType) => {
    handleLogin(data);
    queryClient.invalidateQueries({ queryKey: ["users", "me"] });
  };

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <div className="mb-8 flex flex-col gap-2">
        <div>
          <label className="text-sm" htmlFor="tp-field">
            TP Number:
          </label>
          <Input
            id="tp-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("tpNumber")}
          />
          {errors.tpNumber && (
            <p className="text-red-500 text-xs">{errors.tpNumber.message}</p>
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
        <div className="text-red-500 text-sm mt-2 space-y-1">
          {axios.isAxiosError(loginError) ? (
            <p>{loginError.response?.data.detail.message}</p>
          ) : (
            <p>{loginError.message || 'An error occurred'}</p>
          )}
        </div>
      )}
    </form>
  );
}

