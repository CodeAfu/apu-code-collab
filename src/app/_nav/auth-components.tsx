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
          <Button size="lg" variant="ghost" className="px-4 font-semibold hover:cursor-pointer hover:bg-accent dark:hover:bg-accent rounded-full" onClick={handleRouter}>Login</Button>
          <Button size="lg" variant="outline" className="px-4 font-semibold hover:cursor-pointer hover:bg-primary dark:hover:bg-accent rounded-full" asChild>
            <Link href="/user/register">
              Register
            </Link>
          </Button>
        </div >
      )}
    </>
  );
}
