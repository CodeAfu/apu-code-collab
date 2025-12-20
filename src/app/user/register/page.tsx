import { Suspense } from "react";
import RegisterForm from "./_components/register-form";
import LoadingSpinner from "@/components/loading-spinner";

export default function RegisterPage() {
  return (
    <div
      className="sm:min-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-3rem)] px-4
                    flex flex-col items-center justify-center"
    >
      <Suspense fallback={<Loading />}>
        <RegisterForm />
      </Suspense>
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
