"use client";

import { NavRoute } from "./types";
import NavLink from "./navlink";

interface NavProps {
  routes: NavRoute[];
}

export default function Nav({ routes }: NavProps) {
  return (
    <div className="md:flex hidden items-center h-full">
      {routes.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </div>
  );
}
