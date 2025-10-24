import React, { Suspense } from "react";
import RegisterForm from "./_components/register-form";
import LoadingSpinner from "@/components/loading-spinner";
import Card from "@/components/card";

export default function RegisterPage() {
  return (
    <div
      className="sm:min-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-3rem)] px-4
                    flex flex-col items-center justify-center"
    >
      <Card className="w-full max-w-xs sm:max-w-xl md:max-w-2xl py-12">
        <Suspense fallback={<Loading />}>
          <RegisterForm />
        </Suspense>
      </Card>
    </div>
  );
}

function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
