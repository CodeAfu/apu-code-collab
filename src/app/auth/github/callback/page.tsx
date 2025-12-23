import LoadingSpinner from "@/components/loading-spinner";
import { Suspense } from "react";
import GithubCallback from "./_components/github-callback";

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <GithubCallback />
    </Suspense>
  );
}
