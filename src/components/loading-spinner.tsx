import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

export default function LoadingSpinner({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "size-12 rounded-full border-4 p-2 border-muted border-b-accent animate-spin",
        className
      )}
      {...props}
    />
  );
}
