import RegisterGuide from "@/app/user/register/_components/register-guide";
import Card from "@/components/card";
import React from "react";

export default function RegisterPage() {
  return (
    <div
      className="sm:min-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-3rem)] px-4
                    flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-4xl">
        <Card>{/* Registration form */}</Card>
        {/* <RegisterGuide /> */}
      </div>
    </div>
  );
}
