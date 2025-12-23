"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "../loading-spinner";
import { devLog } from "@/lib/utils";

interface AuthGuardProps {
  children: React.ReactNode;
  withLoadingSpinner?: boolean;
  allowedRoles?: string[];
  requireUserDetails?: boolean;
  requireGitHubAccessToken?: boolean;
  customFallback?: React.ReactNode;
}

export default function AuthGuard({ children, withLoadingSpinner, allowedRoles, requireUserDetails, requireGitHubAccessToken, customFallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading, user, userDetails } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const isWaitingForData = (requireUserDetails || requireGitHubAccessToken) && !userDetails;
  const isRoleMismatch = allowedRoles && user && !allowedRoles.includes(user.role);
  const isMissingGithub = requireGitHubAccessToken && userDetails && !userDetails.is_github_linked;

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(`/user/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    // if (isRoleMismatch) {
    //   router.push("/unauthorized");
    // }

    if (userDetails && isMissingGithub) {
      devLog("Redirecting to GitHub connection...");
      router.push("/connect-github");
    }
  }, [isLoading, isAuthenticated, isWaitingForData, isMissingGithub, isRoleMismatch, router, pathname, userDetails]);

  if (isLoading || !isAuthenticated || isWaitingForData || isMissingGithub || isRoleMismatch) {
    if (!withLoadingSpinner) return null;
    if (customFallback) return customFallback;
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
