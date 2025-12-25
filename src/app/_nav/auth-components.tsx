"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Profile from "@/components/auth/profile";
import { useUser } from "@/hooks/use-user";

export default function AuthComponents() {
  const { isAuthenticated, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const handleRouter = () => {
    router.push(`/user/login?redirectTo=${encodeURIComponent(pathname)}`);
  };

  if (isLoading) return null;

  return (
    <>
      {isAuthenticated ? (
        <Profile />
      ) : (
        <div className="flex items-center gap-2">
          <Button className="hover:cursor-pointer" onClick={handleRouter}>Login</Button>
          <Button asChild>
            <Link href="/user/register">
              Register
            </Link>
          </Button>
        </div >
      )}
    </>
  );
}
