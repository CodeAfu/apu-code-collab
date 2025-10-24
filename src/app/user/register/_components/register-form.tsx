"use client";

import { useIsLoggedIn } from "@/hooks/use-is-logged-in";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormType, registerSchema } from "../types";
import { useMutation } from "@tanstack/react-query";
import { registerQuery } from "../query";
import Card from "@/components/card";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { AuthError } from "@/types/auth";

export default function RegisterForm() {
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
  } = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
  });

  const {
    mutate: handleRegister,
    isPending,
    isError,
    error: queryError,
  } = useMutation(registerQuery());

  const onSubmit = (data: RegisterFormType) => {
    handleRegister(data);
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
      <h1 className="text-2xl font-semibold mb-4">Register</h1>
      <div className="flex gap-4 w-full mb-2">
        <div className="flex-1">
          <label className="text-sm" htmlFor="firstname-field">
            First Name:
          </label>
          <Input
            id="firstname-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="text-sm" htmlFor="lastname-field">
            Last Name:
          </label>
          <Input
            id="lastname-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-8">
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
          <label className="text-sm" htmlFor="apuid-field">
            TP Number:
          </label>
          <Input
            id="apuid-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("apuId")}
          />
          {errors.apuId && (
            <p className="text-red-500 text-xs">{errors.apuId.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm" htmlFor="password-field">
            Password:
          </label>
          <Input
            type="password"
            id="password-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="text-sm" htmlFor="role-field">
            Role:
          </label>
          <select
            id="role-field"
            className="w-full p-2 bg-input border border-border shadow-sm rounded focus:ring-1 focus:ring-ring transition duration-200"
            {...register("role")}
          >
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-xs">{errors.role.message}</p>
          )}
        </div>
      </div>
      <Button disabled={isPending} type="submit">
        Register
      </Button>
      {isError && (
        <p className="text-red-500 text-sm mt-2">{getErrorMessage()}</p>
      )}
    </form>
  );
}
