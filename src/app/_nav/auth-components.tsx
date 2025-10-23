"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Profile from "../_auth/profile";
import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";

export default function AuthComponents() {
  const loggedIn = isLoggedIn();
  return (
    <>
      {loggedIn ? (
        <Profile />
      ) : (
        <Button variant="outline" asChild>
          <Link href="/user/login">Sign in</Link>
        </Button>
      )}
    </>
  );
}
