"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/lib/api";
import LoadingSpinner from "@/components/loading-spinner";
import { devLog, logApiError, sleep } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/hooks/use-user";

export default function GithubCallback() {
  const { isAuthenticated, isLoading } = useUser();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;

    const code = searchParams.get("code");
    if (code && !processed.current) {
      processed.current = true;
      devLog("GitHub Access Code:", code);
      const linkAccount = async () => {
        try {
          await api.post("/api/v1/users/me/github/link", { code });
          queryClient.invalidateQueries({ queryKey: ["users", "me"] });
          sleep(2000);
          router.push("/");
        } catch (error) {
          logApiError(error);
          router.push("/");
        }
      };
      linkAccount();
    }
  }, [searchParams, isLoading, isAuthenticated, router]);

  return (
    <div className="h-screen flex items-center justify-center flex-col gap-4">
      <LoadingSpinner />
      <p className="text-muted-foreground">Linking your GitHub account...</p>
    </div>
  );
}
