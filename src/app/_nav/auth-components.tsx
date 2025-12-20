"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Profile from "../../components/auth/profile";
import { usePathname, useRouter } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/use-is-logged-in";
import Link from "next/link";

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
        <div className="flex items-center gap-2">
          <Button onClick={handleRouter}>Login</Button>
          <Button asChild>
            <Link href="/user/register">
              Register
            </Link>
          </Button>
        </div >
      )
      }
    </>
  );
}
