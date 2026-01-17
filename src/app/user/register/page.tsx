import { Suspense } from "react";
import RegisterForm from "./_components/register-form";
import Skeleton from "@/components/skeleton";

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] px-4 flex flex-col items-center justify-center">
      <Suspense fallback={<FallbackSkeleton />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}

function FallbackSkeleton() {
  return (
    <div className="w-full bg-card shadow sm:p-16 p-8 rounded-lg max-w-4xl">
      <div className="flex flex-col">
        <Skeleton className="w-32 h-8 mb-4" />
        <div className="mb-4">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-24 h-4 mb-2" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="mb-4">
          <Skeleton className="w-32 h-4 mb-2" />
          <Skeleton className="w-full h-10" />
        </div>
        <div className="relative my-4 h-6 flex items-center">
          <div className="absolute w-full border-t border-border" />
          <Skeleton className="w-40 h-6 z-10 rounded" />
        </div>
        <Skeleton className="w-full h-11 mt-4 rounded-md" />
      </div>
    </div>
  );
}
