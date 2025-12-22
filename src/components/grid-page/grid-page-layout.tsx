import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";
import LeftBar from "./left-bar";

export default function GridPageLayout({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
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
