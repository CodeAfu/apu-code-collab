import LoginForm from "@/app/user/login/_components/login-form";
import Card from "@/components/card";
import LoadingSpinner from "@/components/loading-spinner";
import React, { Suspense } from "react";

export default function LoginPage() {
  return (
    <div
      className="sm:min-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-3rem)] px-2
                    flex flex-col items-center justify-center"
    >
      <Card className="w-full max-w-xs sm:max-w-xl md:max-w-2xl py-12">
        <Suspense fallback={<Loading />}>
          <LoginForm />
        </Suspense>
      </Card>
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
