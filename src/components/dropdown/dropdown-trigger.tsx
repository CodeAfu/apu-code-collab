"use client";

import { HTMLAttributes, RefObject } from "react";
import { cn } from "@/lib/utils";

interface DropdownTriggerProps extends HTMLAttributes<HTMLDivElement> {
  ref: RefObject<HTMLDivElement | null>;
}

export default function DropdownTrigger({
  ref,
  className,
  children,
  ...props
}: DropdownTriggerProps) {
  return (
    <div
      ref={ref}
      className={cn("relative inline-block group-focus:ring-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}
