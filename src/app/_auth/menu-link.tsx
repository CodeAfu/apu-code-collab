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
        "flex items-center gap-2 p-2 text-primary hover:bg-primary/5 active:bg-primary/5 transition duration-200",
        className
      )}
      {...props}
    >
      <span className="size-8 flex items-center justify-center">{icon}</span>
      {children}
    </Link>
  );
}
