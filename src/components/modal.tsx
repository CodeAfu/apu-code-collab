"use client";

import React from "react";
import { Fragment, HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import Backdrop from "./backdrop";
import { cn } from "@/lib/utils";
import useMounted from "@/hooks/use-mounted";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "screen";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  isOpen: boolean;
  onClose: () => void;
}

export default function Modal({
  size = "md",
  isOpen,
  onClose,
  className,
  children,
  ...props
}: ModalProps) {
  const mounted = useMounted();

  if (!mounted || !isOpen) return null;

  const computedSize = computeSize(size);

  return createPortal(
    <Fragment>
      <Backdrop onClose={onClose} />
      <div
        data-modal-content
        className={cn(
          "group z-100 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "w-full px-2",
          computedSize
        )}
        {...props}
      >
        <div
          data-modal-content
          className={cn(
            "bg-card text-card-foreground p-4 rounded animate-fade-in",
            className
          )}
        >
          {children}
        </div>
      </div>
    </Fragment>,
    document.body
  );
}

function computeSize(size: Size): string {
  switch (size) {
    case "xs":
      return "max-w-xs";
    case "sm":
      return "max-w-sm";
    case "md":
      return "max-w-md";
    case "lg":
      return "max-w-lg";
    case "xl":
      return "max-w-xl";
    case "screen":
      return "max-w-[95vw]";
    default:
      return "max-w-md";
  }
}
