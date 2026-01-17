"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  label: string;
  href: string;
}

export default function NavLink({
  label,
  href,
  className,
  ...props
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = href === "/"
    ? pathname === href
    : pathname.startsWith(href)

  return (
    <div className="h-full group relative overflow-hidden">
      {isActive && (
        <div
          className="bg-primary/5 absolute inset-0 pointer-events-none
                      transition duration-300 animate-slide-up"
        />
      )}
      <Link
        href={href}
        className={cn(
          "h-full px-2 w-full text-lg text-sidebar-foreground flex items-center justify-center transition duration-100",
          "hover:text-accent active:bg-accent/10 active:text-accent",
          isActive ? "border-b border-accent font-semibold" : "",
          className
        )}
        {...props}
      >
        {label}
      </Link>
    </div>
  );
}
