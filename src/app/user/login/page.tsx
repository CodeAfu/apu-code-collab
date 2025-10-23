import LoginForm from "@/app/_nav/login-form";
import Card from "@/components/card";
import React from "react";

export default function LoginPage() {
  return (
    <div
      className="sm:min-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-3rem)] px-2
                    flex flex-col items-center justify-center"
    >
      <Card className="w-full max-w-xs sm:max-w-xl md:max-w-2xl py-12">
        <LoginForm />
      </Card>
    </div>
  );
}
