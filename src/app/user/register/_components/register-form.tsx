"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RegisterFormType, registerSchema } from "../types";
import { useMutation } from "@tanstack/react-query";
import { registerMutationOptions } from "../query";
import { Input } from "@/components/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

export default function RegisterForm() {
  const [showOptionalInfo, setShowOptionalInfo] = useState(false);
  // const loggedIn = useIsLoggedIn();
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const redirectTo = searchParams.get("redirectTo") || "/";

  // useEffect(() => {
  //   if (loggedIn) router.push(redirectTo);
  // }, [loggedIn, router, redirectTo]);

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
    error: registerError,
  } = useMutation(registerMutationOptions());

  const onSubmit = (data: RegisterFormType) => {
    handleRegister(data);
  };

  return (
    <div className="w-full bg-card shadow sm:p-16 p-8 rounded-lg max-w-4xl">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <div>
          <label className="text-sm" htmlFor="apuid-field">
            TP Number: <span className="text-destructive">*</span>
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
            Password: <span className="text-destructive">*</span>
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
          <label className="text-sm" htmlFor="re-password-field">
            Retype Your Password: <span className="text-destructive">*</span>
          </label>
          <Input
            type="password"
            id="re-password-field"
            className="py-1 text-sm sm:text-base rounded"
            {...register("rePassword")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div className="relative my-4">
          <div className="absolute left-0 top-1/2 border-t border-border -translate-y-1/2 w-full z-0"></div>
          <button
            type="button"
            onClick={() => setShowOptionalInfo(!showOptionalInfo)}
            className={cn(
              "inline-flex gap-2 relative bg-card border border-border rounded p-1 text-xs z-10",
              "hover:cursor-pointer hover:bg-muted/20 hover:text-foreground transition duration-200",
              showOptionalInfo ? "text-foreground ring" : "text-muted-foreground"
            )}
          >
            Personal Information {showOptionalInfo ? <span><Minus className="w-4 h-4" /></span> : <span><Plus className="w-4 h-4" /></span>}
          </button>
        </div>

        <AnimatePresence>
          {showOptionalInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="overflow-hidden"
            >
              <div className="flex flex-col border border-border rounded-lg px-4 mb-4">
                <p className="text-muted-foreground text-xs mt-4 italic mb-2">Optional</p>
                <div className="flex sm:flex-row flex-col gap-4 w-full mb-2">
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

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Button className="hover:cursor-pointer text-lg mt-4" size="lg" disabled={isPending} type="submit">
          Register
        </Button>
        {isError && (
          <div className="text-red-500 text-sm mt-2 space-y-1">
            {axios.isAxiosError(registerError) ? (
              <p>{registerError.response?.data.detail.message}</p>
            ) : (
              <p>{registerError?.message || 'An error occurred'}</p>
            )}
          </div>
        )}
      </form >
    </div >
  );
}

