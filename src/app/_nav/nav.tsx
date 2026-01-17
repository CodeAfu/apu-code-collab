"use client";

import { NavRoute } from "./types";
import NavLink from "./navlink";
import { useUser } from "@/hooks/use-user";

interface NavProps {
  routes: NavRoute[];
}

export default function Nav({ routes }: NavProps) {
  const { decodedUserToken } = useUser();
  const isAdmin = decodedUserToken?.role === "admin";

  const visibleRoutes = routes.filter((item) => {
    if (isAdmin) return true;
    return !item.adminOnly;
  });
  return (
    <div className="md:flex hidden items-center h-full">
      {visibleRoutes.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  );
}
