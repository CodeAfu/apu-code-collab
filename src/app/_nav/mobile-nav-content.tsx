"use client";

import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import { NavRoute } from "./types";
import useMounted from "@/hooks/use-mounted";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Backdrop from "@/components/backdrop";
import { X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import Avatar from "@/components/avatar";

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

  if (!mounted) return null;

  return createPortal(
    <Fragment>
      {isOpen && <Backdrop onClose={onClose} />}
      <nav
        data-sidenav-content
        className={cn(
          "fixed right-0 top-0 z-100 w-64 h-screen bg-sidebar shadow-lg transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div data-sidenav-content className="flex flex-col">
          <div className="h-16 px-2 relative flex gap-2 items-center">
            <Avatar src="/assets/user.svg" alt="avatar" />
            <ThemeToggle />
            <button onClick={onClose} className="absolute right-5 top-5 hover:text-destructive-foreground">
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
        </div>
      </nav>
    </Fragment>,
    document.body
  );
}
