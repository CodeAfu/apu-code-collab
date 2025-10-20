import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { HTMLAttributes, ReactNode } from "react";

interface MenuLink extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon: ReactNode;
}

export default function MenuLink({
  href,
  icon,
  children,
  className,
  ...props
}: MenuLink) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 px-2 py-1 h-10 text-sm text-card-foreground",
        "hover:bg-popover hover:text-popover-foreground active:bg-popover active:text-popover-foreground",
        "transition duration-200",
        className
      )}
      {...props}
    >
      <span className="size-4 flex items-center justify-center">{icon}</span>
      {children}
    </Link>
  );
}
