import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { HTMLAttributes } from "react";

export default function LoadingSpinner({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "size-16",
        className
      )}
      {...props}
    >
      <Loader2 className="w-full h-full text-muted-foreground animate-spin" />
    </div>
  );
}
