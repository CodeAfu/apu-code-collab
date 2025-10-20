"use client";

import React, { Fragment } from "react";
import { createPortal } from "react-dom";
import LeftBar from "./left-bar";
import Backdrop from "../backdrop";
import useMounted from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

interface MobileGridLeftContentProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileGridLeftContent({
  isOpen,
  onClose,
}: MobileGridLeftContentProps) {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(
    <Fragment>
      {isOpen && (
        <>
          <Backdrop onClose={onClose} />
        </>
      )}
      <LeftBar
        onClose={onClose}
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-100",
          "transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      />
    </Fragment>,
    document.body
  );
}
