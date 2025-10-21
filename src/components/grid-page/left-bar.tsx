"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { HTMLAttributes, RefObject } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";

interface SidebarProps extends HTMLAttributes<HTMLDivElement> {
  ref?: RefObject<HTMLDivElement>;
  onClose?: () => void;
}

export default function LeftBar({
  onClose,
  ref,
  className,
  ...props
}: SidebarProps) {
  return (
    <div
      ref={ref}
      className={cn("h-full bg-sidebar overflow-y-scroll [direction:rtl]", className)}
      {...props}
    >
      {onClose && (
        <div className="h-24 w-full relative">
          <Button onClick={onClose} variant="ghost" size="icon" className="absolute top-4 right-4">
            <X />
          </Button>
        </div>
      )}
      <div className="flex flex-col h-full p-8 [direction:ltr]">
        <h1 className="mb-2 font-semibold">Repositories</h1>
        <div className="flex flex-col gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <RepositoryLink href="#" key={i}>
              Repository {i + 1}
            </RepositoryLink>
          ))}
        </div>
      </div>
    </div>
  );
}

interface RepositoryLinkProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string;
}

function RepositoryLink({
  children,
  className,
  href,
  ...props
}: RepositoryLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "w-fit whitespace-nowrap overflow-hidden max-w-50 text-sm",
        "hover:underline active:underline",
        "transition duration-200",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}
