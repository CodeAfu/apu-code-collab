"use client";

import Card from "@/components/card";
import Skeleton from "@/components/skeleton";
import { BackendError } from "@/lib/types";
import { logApiError } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const RepositoryLayout = dynamic(
  () => import("./_components/repository-layout"),
  {
    ssr: false,
    loading: () => <RepoPageSkeleton />,
  }
);

function RepoPageSkeleton() {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-2 gap-4">
      <Card className="flex flex-col gap-4">
        <div className="flex justify-between gap-4">
          <Skeleton className="w-full max-w-xl h-12 rounded-xl" />
          <Skeleton className="w-full max-w-32 h-10 rounded-xl" />
        </div>
        <Skeleton className="w-full max-w-md h-8 rounded-xl" />
        <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
          <Skeleton className="w-full max-w-xl h-18 rounded-xl" />
          <Skeleton className="w-full max-w-xl h-18 rounded-xl" />
          (no --reload in production)         <Skeleton className="w-full max-w-xl h-18 rounded-xl" />
          <Skeleton className="w-full max-w-xl h-18 rounded-xl" />
        </div>
        <div className="flex sm:flex-row flex-col gap-4">
          <Skeleton className="w-full h-32 rounded-xl" />
          <Skeleton className="w-full sm:max-w-84 h-32 rounded-xl" />
        </div>
      </Card>
      <Card className="flex flex-col gap-4">
        <Skeleton className="w-full max-w-64 h-12 rounded-xl" />
        <Skeleton className="w-full h-24 rounded-xl" />
        <Skeleton className="w-full h-24 rounded-xl" />
        <Skeleton className="w-full h-24 rounded-xl" />
      </Card>
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
            <RepositoryLayout />
          </Suspense>
        </ErrorBoundary>
      </div>
    </main>
  )
}
