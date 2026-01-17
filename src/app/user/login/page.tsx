import LoginForm from "@/app/user/login/_components/login-form";
import Card from "@/components/card";
import Skeleton from "@/components/skeleton";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] px-2 flex flex-col items-center justify-center">
      <Card className="w-full max-w-xs sm:max-w-xl md:max-w-2xl py-12">
        <Suspense fallback={<FallbackSkeleton />}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}

function FallbackSkeleton() {
  return (
    <div className="flex flex-col w-full">
      <Skeleton className="w-24 mb-4" />
      <div className="mb-8 flex flex-col gap-2">
        <div>
          <Skeleton className="h-4 w-20 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div>
          <Skeleton className="h-4 w-16 mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
}
