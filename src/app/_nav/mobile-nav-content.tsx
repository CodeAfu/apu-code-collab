"use client";

import { cn } from "@/lib/utils";
import { Fragment, HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { NavRoute } from "./types";
import useMounted from "@/hooks/use-mounted";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Backdrop from "@/components/backdrop";
import { X } from "lucide-react";
import { useProfileMenu } from "@/hooks/use-profile-menu";
import { ProfileItemType } from "@/lib/types";
import AuthComponents from "./auth-components";

interface MobileNavProps {
  routes: NavRoute[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavContent({
  routes,
  isOpen,
  onClose,
}: MobileNavProps) {
  const mounted = useMounted();
  const pathname = usePathname();
  const profileMenus = useProfileMenu();

  if (!mounted) return null;

  return createPortal(
    <Fragment>
      {isOpen && <Backdrop onClose={onClose} />}
      <nav
        data-sidenav-content
        className={cn(
          "fixed right-0 top-0 z-100 w-64 h-screen bg-sidebar shadow-lg",
          "overflow-y-scroll transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div data-sidenav-content className="flex flex-col">
          <div className="h-16 px-2 relative flex gap-2 items-center">
            <AuthComponents />
            <button
              onClick={onClose}
              className="absolute right-5 top-5 hover:text-destructive-foreground"
            >
              <X />
            </button>
          </div>
          <hr />
          <div data-sidenav-content className="py-4 flex flex-col">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={onClose}
                className={cn(
                  "block px-4 py-2 active:bg-primary/5",
                  route.href === pathname && "font-semibold bg-primary/5"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>

          {/* TODO: Render conditionally when logged in */}
          <hr />
          <div data-sidenav-content className="py-4 flex flex-col">
            {profileMenus.map((item, index) => (
              <MobileNavProfileItem
                key={`mobile-profile-item-${index}`}
                item={item}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </nav>
    </Fragment>,
    document.body
  );
}

interface MobileNavProfileItemProps
  extends Omit<HTMLAttributes<HTMLElement>, "onClick"> {
  item: ProfileItemType;
  onClose: () => void;
}

function MobileNavProfileItem({
  item,
  onClose,
  className,
  ...props
}: MobileNavProfileItemProps) {
  if (item.type === "separator") {
    return;
  }

  const baseClasses = cn(
    "flex items-center gap-2 px-2 py-1 h-10 text-sm text-card-foreground",
    "hover:bg-popover hover:text-popover-foreground active:bg-popover active:text-popover-foreground",
    "transition duration-200",
    className
  );

  const content = (
    <>
      <span>{item.icon}</span>
      {item.label}
    </>
  );

  if (item.type === "link") {
    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={baseClasses}
        {...props}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={() => {
        item.onClick();
        onClose();
      }}
      className={baseClasses}
      {...props}
    >
      {content}
    </button>
  );
}
