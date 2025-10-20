"use client";

import React, { Fragment, useState } from "react";
import { Button } from "../ui/button";
import { Sidebar as SidebarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import MobileGridLeftContent from "./mobile-grid-left-content";

export default function MobileGridLeftToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <Button
        onClick={handleClick}
        variant="ghost"
        size="icon"
        className={cn(
          "md:hidden flex",
          "transition duration-200",
          isOpen ? "bg-muted" : ""
        )}
      >
        <SidebarIcon className={cn("", isOpen ? "stroke-primary" : "")} />
      </Button>
      <MobileGridLeftContent isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Fragment>
  );
}
