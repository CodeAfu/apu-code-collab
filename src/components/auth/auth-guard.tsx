"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  withLoadingSpinner?: boolean;
  allowedRoles?: string[];
}

export default function AuthGuard({ children, withLoadingSpinner, allowedRoles }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/user/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    // if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    //   router.push("/");
    // }
  }, [isAuthenticated, isLoading, user, allowedRoles, router, pathname]);

  if (isLoading || !isAuthenticated) {
    if (!withLoadingSpinner) return null;

    return (
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <LoadingSpinner />
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user?.role || "")) {
    return null;
  }

  return <>{children}</>;
}
