import LoginForm from "@/app/user/login/_components/login-form";
import Card from "@/components/card";
import LoadingSpinner from "@/components/loading-spinner";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] px-2 flex flex-col items-center justify-center">
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
