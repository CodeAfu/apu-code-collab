import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function GridPageLayout({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "h-full grid",
        className
      )}
      {...props}
    >
      <div>{children}</div>
    </div>
  );
}
