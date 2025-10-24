import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

export default function Card({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground px-8 sm:px-16 py-8 shadow-lg rounded-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
