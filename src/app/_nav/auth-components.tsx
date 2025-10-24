"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Profile from "../../components/auth/profile";
import { isLoggedIn } from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

export default function AuthComponents() {
  const loggedIn = isLoggedIn();
  const router = useRouter();
  const pathname = usePathname();

  const handleRouter = () => {
    router.push(`/user/login?redirectTo=${encodeURIComponent(pathname)}`);
  };

  return (
    <>
      {loggedIn ? (
        <Profile />
      ) : (
        <Button onClick={handleRouter} variant="outline">
          Sign in
        </Button>
      )}
    </>
  );
}
