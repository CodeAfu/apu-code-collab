"use client";

import { Fragment, HTMLAttributes } from "react";
import { createPortal } from "react-dom";
import Backdrop from "./backdrop";
import { cn } from "@/lib/utils";
import useMounted from "@/hooks/use-mounted";
import { AnimatePresence, motion } from "motion/react";

type Size = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "screen";

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
  if (!mounted) return null;
  const computedSize = computeSize(size);
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <Backdrop onClose={onClose} />
          <div
            className={cn(
              "z-[100] fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "w-full px-2 outline-none",
              computedSize
            )}
            {...props}
          >
            <motion.div
              key="modal-content"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className={cn(
                "bg-card text-card-foreground p-4 rounded shadow-lg overflow-hidden",
                className
              )}
            >
              {children}
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>,
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
    case "2xl":
      return "max-w-2xl";
    case "3xl":
      return "max-w-3xl";
    case "4xl":
      return "max-w-4xl";
    case "5xl":
      return "max-w-5xl";
    case "6xl":
      return "max-w-6xl";
    case "7xl":
      return "max-w-7xl";
    case "screen":
      return "max-w-[95vw]";
    default:
      return "max-w-md";
  }
}
