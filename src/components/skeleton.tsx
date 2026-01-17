import { cn } from "@/lib/utils";

export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-md animate-pulse h-8 bg-popover-foreground/5", className)}
      {...props}
    >
    </div>
  );
}
