import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";
import LeftBar from "./left-bar";

interface SidebarPageProps extends HTMLAttributes<HTMLDivElement> {}

export default function GridPageLayout({
  className,
  children,
  ...props
}: SidebarPageProps) {
  return (
    <div
      className={cn(
        "sm:min-h-[calc(100dvh-4rem)] min-h-[calc(100dvh-3rem)]",
        "grid md:grid-cols-[280px_1fr]",
        className
      )}
      {...props}
    >
      <aside className="md:block hidden h-full border-r border-border">
        <LeftBar />
      </aside>
      <div>{children}</div>
    </div>
  );
}
