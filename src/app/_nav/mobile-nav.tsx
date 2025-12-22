"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Fragment, useState } from "react";
import MobileNavContent from "./mobile-nav-content";
import { NavRoute } from "./types";

interface MobileNavProps {
  routes: NavRoute[];
}

export default function MobileNav({ routes }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Fragment>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        variant="outline"
        className="md:hidden flex items-center justify-center"
      >
        <Menu className="h-5 w-5" />
      </Button>
      <MobileNavContent routes={routes} isOpen={isOpen} onClose={handleClose} />
    </Fragment>
  );
}
