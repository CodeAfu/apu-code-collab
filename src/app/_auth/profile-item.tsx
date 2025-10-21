import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { HTMLAttributes } from "react";
import { ProfileItemType } from "@/lib/types";

interface ProfileItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  item: ProfileItemType;
}

export default function ProfileItem({
  item,
  className,
  ...props
}: ProfileItemProps) {
  if (item.type === "separator") {
    return <div className="h-px bg-border my-1" />;
  }

  const baseClasses = cn(
    "flex items-center gap-2 px-2 py-1 h-10 text-sm text-card-foreground",
    "hover:bg-popover hover:text-popover-foreground active:bg-popover active:text-popover-foreground",
    "transition duration-200",
    className
  );

  const content = (
    <>
      <span className="size-4 flex items-center justify-center">
        {item.icon}
      </span>
      {item.label}
    </>
  );

  if (item.type === "link") {
    return (
      <Link href={item.href} className={baseClasses} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={item.onClick} className={baseClasses} {...props}>
      {content}
    </button>
  );
}
