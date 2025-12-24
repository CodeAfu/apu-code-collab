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
      {/*
        <div
          className={cn(
            "absolute",
            // 1. Position: Center the starting point relative to parent
            "top-1/2 left-1/2",
            // 2. Size: Make it huge so the diagonal pass covers everything
            "w-[200%] h-[200%]",
            // 3. Offset: Pull it back so 'translate(0,0)' would be centered
            "-translate-x-1/2 -translate-y-1/2",

            // 4. Animation: The diagonal movement defined in config
            "animate-shimmer",

            // 5. Gradient: 135deg points exactly to Bottom-Right
            "bg-gradient-to-br from-transparent via-popover-foreground/5 to-transparent",
          )}
        />
      */}
    </div>
  );
}
