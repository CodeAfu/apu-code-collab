"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Profile from "../../components/auth/profile";
import { usePathname, useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/use-is-logged-in";

export default function AuthComponents() {
  const loggedIn = useIsLoggedIn();
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
        <Button onClick={handleRouter} variant="secondary">
          Sign in
        </Button>
      )}
    </>
  );
}
