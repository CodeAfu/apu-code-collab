"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  icon?: React.ElementType;
}

export default function TabButton({ children, className, href, icon: Icon, ...props }: TabButtonProps) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-md px-6 py-4 text-sm font-medium transition-all duration-200",
        "text-foreground-subtle hover:text-foreground",
        "hover:bg-accent/20 hover:translate-x-1",
        isActive && "bg-primary/10 text-primary font-semibold shadow-sm pointer-events-none",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 transition-colors",
            isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
      )}
      {children}
    </Link>
  );
}
