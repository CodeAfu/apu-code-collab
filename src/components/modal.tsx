"use client";

import React from "react";
import { Fragment, HTMLAttributes, useState } from "react";
import { createPortal } from "react-dom";
import Backdrop from "./backdrop";
import { cn } from "@/lib/utils";
import useMounted from "@/hooks/use-mounted";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "screen";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  size?: Size;
  isOpen: boolean;
  onClose: () => void;
  exitAnimationDuration?: number;
}

export default function Modal({
  size = "md",
  isOpen,
  onClose,
  exitAnimationDuration = 100,
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
          "z-100 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
          "bg-card w-full text-card-foreground p-4 rounded animate-fade-in",
          computedSize,
          className
        )}
        {...props}
      >
        {children}
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
