"use client";

import Skeleton from "@/components/skeleton";
import { BackendError } from "@/lib/types";
import { logApiError } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const SharedRepositoryInfo = dynamic(
  () => import("./_components/shared-repository-info"),
  {
    ssr: false,
    loading: () => <RepoPageSkeleton />,
  }
);

function RepoPageSkeleton() {
  return (
    <div className="flex flex-col px-2 gap-4">
      <Skeleton className="w-full max-w-xl h-8 rounded-xl" />
      <Skeleton className="w-full h-32 rounded-xl" />
      <Skeleton className="w-full max-w-lg h-8 rounded-xl" />
      <Skeleton className="w-full h-32 rounded-xl" />
    </div>
  )
}

function ErrorFallback({ error }: { error: Error }) {
  logApiError(error);
  const backendError = error as BackendError;
  const errorMessage = backendError.response?.data?.detail || error.message;
  return (
    <div className="text-destructive flex flex-col items-center justify-center p-4 border border-destructive/50 rounded bg-destructive/10">
      <h2 className="font-bold">Something went wrong</h2>
      <p>{errorMessage}</p>
    </div>
  );
}

export default function RepoPage() {
  return (
    <main className="container mx-auto sm:my-8 my-4">
      <div className="flex flex-col sm:p-8 p-4">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<RepoPageSkeleton />}>
            <SharedRepositoryInfo />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}
