import React from "react";
import NavLink from "./navlink";

const routes = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Browse",
    href: "/browse",
  },
  {
    label: "Animate",
    href: "/animate",
  },
];

export default function Navbar() {
  return (
    <nav className="h-16 bg-accent/50 flex px-4 items-center gap-4">
      <div>Logo</div>
      <div className="flex gap-2 items-center h-full">
        {routes.map((item) => (
          <NavLink key={item.href} href={item.href} label={item.label} />
        ))}
      </div>
    </nav>
  );
}
