import GridPageLayout from "@/components/grid-page/grid-page-layout";
import AuthGuard from "@/components/auth/auth-guard";
import BrowseContents from "./_components/browse-contents";
import { Suspense } from "react";
import Card from "@/components/card";
import Skeleton from "@/components/skeleton";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4 mx-auto w-full max-w-7xl sm:my-8 my-4">
      <Skeleton className="h-12 rounded" />
      <Card className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="w-32 h-4 rounded" />
              <Skeleton className="w-24 h-3 rounded" />
            </div>
          </div>
          <Skeleton className="w-full h-12 rounded" />
        </div>
      </Card>
    </div>
  )
}

export default function BrowsePage() {
  return (
    <div className="flex flex-col">
      <AuthGuard requireGitHubAccessToken fallback={<LoadingSkeleton />}>
        <GridPageLayout>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col gap-4">
              <Suspense fallback={<LoadingSkeleton />}>
                <BrowseContents />
              </Suspense>
            </div>
          </div>
        </GridPageLayout>
      </AuthGuard>
    </div>
  );
}
