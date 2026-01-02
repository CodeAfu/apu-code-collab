"use client";

import {
  HTMLAttributes,
  RefObject,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { AnchorPosition } from "./types";

interface Position {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  transform?: string;
}

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  ref: RefObject<HTMLDivElement | null>;
  triggerRef: RefObject<HTMLDivElement | null>;
  anchor?: AnchorPosition;
  offset?: number;
  preventOverflow?: boolean;
  handleClose?: () => void;
}

// Helper to safely use layout effect on server vs client
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export default function DropdownContent({
  children,
  triggerRef,
  anchor = "bottom-left",
  offset = 8,
  preventOverflow = true,
  className,
  ref,
  handleClose,
  style, }: DropdownContentProps) {
  const [position, setPosition] = useState<Position>({});

  // Ensure we mount only on client to access document.body
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const updatePosition = () => {
    if (!triggerRef.current || !ref.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = ref.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const newPosition: Position = {};

    switch (anchor) {
      case "bottom-left":
        newPosition.top = triggerRect.bottom + offset;
        newPosition.left = triggerRect.left;
        break;
      case "bottom-center":
        newPosition.top = triggerRect.bottom + offset;
        newPosition.left = triggerRect.left + triggerRect.width / 2;
        newPosition.transform = "translateX(-50%)";
        break;
      case "bottom-right":
        newPosition.top = triggerRect.bottom + offset;
        // Align right edge of content with right edge of trigger
        // left = triggerRight - contentWidth
        newPosition.left = triggerRect.right - contentRect.width;
        break;

      case "top-left":
        newPosition.top = triggerRect.top - contentRect.height - offset;
        newPosition.left = triggerRect.left;
        break;
      case "top-center":
        newPosition.top = triggerRect.top - contentRect.height - offset;
        newPosition.left = triggerRect.left + triggerRect.width / 2;
        newPosition.transform = "translateX(-50%)";
        break;
      case "top-right":
        newPosition.top = triggerRect.top - contentRect.height - offset;
        newPosition.left = triggerRect.right - contentRect.width;
        break;

      case "left-top":
        newPosition.top = triggerRect.top;
        newPosition.left = triggerRect.left - contentRect.width - offset;
        break;
      case "left-center":
        newPosition.top = triggerRect.top + triggerRect.height / 2;
        newPosition.left = triggerRect.left - contentRect.width - offset;
        newPosition.transform = "translateY(-50%)";
        break;
      case "left-bottom":
        newPosition.top = triggerRect.bottom - contentRect.height;
        newPosition.left = triggerRect.left - contentRect.width - offset;
        break;

      case "right-top":
        newPosition.top = triggerRect.top;
        newPosition.left = triggerRect.right + offset;
        break;
      case "right-center":
        newPosition.top = triggerRect.top + triggerRect.height / 2;
        newPosition.left = triggerRect.right + offset;
        newPosition.transform = "translateY(-50%)";
        break;
      case "right-bottom":
        newPosition.top = triggerRect.bottom - contentRect.height;
        newPosition.left = triggerRect.right + offset;
        break;
    }

    if (preventOverflow && newPosition.top !== undefined && newPosition.left !== undefined) {

      // Check Bottom Overflow
      if (newPosition.top + contentRect.height > viewportHeight) {
        // If it was bottom-*, flip to top
        if (anchor.startsWith("bottom")) {
          newPosition.top = triggerRect.top - contentRect.height - offset;
        }
      }

      // Check Top Overflow
      if (newPosition.top < 0) {
        // If it was top-*, flip to bottom
        if (anchor.startsWith("top")) {
          newPosition.top = triggerRect.bottom + offset;
        }
      }

      // Check Right Overflow
      // (Calculate actual right edge including width)
      const currentRight = newPosition.left + contentRect.width;
      if (currentRight > viewportWidth) {
        // Shift left to fit
        newPosition.left = viewportWidth - contentRect.width - 8; // 8px padding
      }

      // Check Left Overflow
      // (If transform is centering, actual left is calculated differently, but simplified here)
      if (newPosition.left < 0) {
        newPosition.left = 8; // 8px padding
      }
    }

    setPosition(newPosition);
  };

  // Recalculate on mount, scroll, resize
  useIsomorphicLayoutEffect(() => {
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [mounted, anchor, offset, preventOverflow, triggerRef]);

  if (!mounted) return null;

  return createPortal(
    <motion.div
      ref={ref}
      onClick={() => {
        handleClose?.();
      }}
      style={{
        ...style,
        position: "fixed",
        top: position.top ?? 0,
        left: position.left ?? 0,
        transform: position.transform,
        // Ensure max height fits within viewport
        maxHeight: "calc(100vh - 16px)",
        overflowY: "auto",
        // Hide until calculated (prevents jump)
        visibility: Object.keys(position).length === 0 ? "hidden" : "visible"
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.15, ease: "easeOut" },
      }}
      exit={{
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.15, ease: "easeIn" },
      }}
      className={cn(
        "z-50 bg-card min-w-[12rem] max-w-[calc(100vw-16px)] overflow-scroll",
        "border border-border shadow-lg rounded-md",
        className
      )}
    >
      {children}
    </motion.div>,
    document.body
  );
}
