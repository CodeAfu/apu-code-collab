"use client";

import { useUser } from "@/hooks/use-user";
import LandingView from "./_dashboard/_components/landing-view";
import DashboardView from "./_dashboard/_components/dashboard-view";
import LoadingSpinner from "@/components/loading-spinner";
import AuthGuard from "@/components/auth/auth-guard";

export default function HomePage() {
  const { isAuthenticated, userDetails, isLoading } = useUser();

  if (isLoading) {
    return <div className="flex flex-col items-center justify-center"><LoadingSpinner /></div>;
  }

  if (!isAuthenticated) {
    return <LandingView />;
  }

  return (
    <AuthGuard requireGitHubAccessToken withLoadingSpinner>
      <DashboardView user={userDetails} />
    </AuthGuard>
  );
}
