"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { HTMLAttributes, RefObject, useEffect, useState } from "react";
import { AnchorPosition } from "./types";
import { createPortal } from "react-dom";

interface Position {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  transform?: string;
}

interface DropdownContentProps extends HTMLAttributes<HTMLDivElement> {
  ref: RefObject<HTMLDivElement | null>;
  triggerHeight?: number;
  triggerWidth?: number;
  anchor?: AnchorPosition;
  offset?: number;
  preventOverflow?: boolean;
}

export default function DropdownContent({
  children,
  triggerHeight = 0,
  triggerWidth = 0,
  anchor = "bottom-left",
  offset = 8,
  preventOverflow = true,
  className,
  ref,
}: DropdownContentProps) {
  const [position, setPosition] = useState<Position>({});

  useEffect(() => {
    if (!ref.current) return;

    const updatePosition = () => {
      const dropdown = ref.current;
      if (!dropdown) return;

      const rect = dropdown.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      const newPosition: Position = {};

      // Calculate initial position based on anchor
      switch (anchor) {
        case "bottom-left":
          newPosition.top = triggerHeight + offset;
          newPosition.left = 0;
          break;
        case "bottom-center":
          newPosition.top = triggerHeight + offset;
          newPosition.left = triggerWidth / 2;
          newPosition.transform = "translateX(-50%)";
          break;
        case "bottom-right":
          newPosition.top = triggerHeight + offset;
          newPosition.right = 0;
          break;
        case "top-left":
          newPosition.bottom = triggerHeight + offset;
          newPosition.left = 0;
          break;
        case "top-center":
          newPosition.bottom = triggerHeight + offset;
          newPosition.left = triggerWidth / 2;
          newPosition.transform = "translateX(-50%)";
          break;
        case "top-right":
          newPosition.bottom = triggerHeight + offset;
          newPosition.right = 0;
          break;
        case "left-top":
          newPosition.right = triggerWidth + offset;
          newPosition.top = 0;
          break;
        case "left-center":
          newPosition.right = triggerWidth + offset;
          newPosition.top = triggerHeight / 2;
          newPosition.transform = "translateY(-50%)";
          break;
        case "left-bottom":
          newPosition.right = triggerWidth + offset;
          newPosition.bottom = 0;
          break;
        case "right-top":
          newPosition.left = triggerWidth + offset;
          newPosition.top = 0;
          break;
        case "right-center":
          newPosition.left = triggerWidth + offset;
          newPosition.top = triggerHeight / 2;
          newPosition.transform = "translateY(-50%)";
          break;
        case "right-bottom":
          newPosition.left = triggerWidth + offset;
          newPosition.bottom = 0;
          break;
      }

      // Overflow prevention
      if (preventOverflow) {
        // const dropdownRect = dropdown.getBoundingClientRect();
        const parentRect = dropdown.parentElement?.getBoundingClientRect();

        if (!parentRect) return;

        // Check if dropdown overflows viewport
        const overflowBottom =
          parentRect.top + (newPosition.top || 0) + rect.height >
          viewportHeight;
        const overflowTop =
          parentRect.top - (newPosition.bottom || 0) - rect.height < 0;
        const overflowRight =
          parentRect.left + (newPosition.left || 0) + rect.width >
          viewportWidth;
        const overflowLeft =
          parentRect.left - (newPosition.right || 0) - rect.width < 0;

        // Flip vertically if needed
        if (overflowBottom && !overflowTop && anchor.startsWith("bottom")) {
          delete newPosition.top;
          newPosition.bottom = triggerHeight + offset;
        } else if (overflowTop && !overflowBottom && anchor.startsWith("top")) {
          delete newPosition.bottom;
          newPosition.top = triggerHeight + offset;
        }

        // Flip horizontally if needed
        if (overflowRight && !overflowLeft) {
          if (newPosition.left !== undefined) {
            delete newPosition.left;
            newPosition.right = 0;
          }
        } else if (overflowLeft && !overflowRight) {
          if (newPosition.right !== undefined) {
            delete newPosition.right;
            newPosition.left = 0;
          }
        }

        // Adjust horizontal centering if overflowing
        if (
          anchor.includes("center") &&
          newPosition.transform?.includes("translateX")
        ) {
          const wouldOverflowRight =
            parentRect.left + triggerWidth / 2 + rect.width / 2 > viewportWidth;
          const wouldOverflowLeft =
            parentRect.left + triggerWidth / 2 - rect.width / 2 < 0;

          if (wouldOverflowRight) {
            delete newPosition.left;
            delete newPosition.transform;
            newPosition.right = 0;
          } else if (wouldOverflowLeft) {
            delete newPosition.left;
            delete newPosition.transform;
            newPosition.left = 0;
          }
        }
      }

      setPosition(newPosition);
    };

    // Initial position calculation
    updatePosition();

    // Recalculate on scroll or resize
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [triggerHeight, triggerWidth, anchor, offset, preventOverflow, ref]);

  return (
    <motion.div
      ref={ref}
      style={{
        top: position.top !== undefined ? `${position.top}px` : undefined,
        bottom:
          position.bottom !== undefined ? `${position.bottom}px` : undefined,
        left: position.left !== undefined ? `${position.left}px` : undefined,
        right: position.right !== undefined ? `${position.right}px` : undefined,
        transform: position.transform,
        maxHeight: "calc(100vh - 16px)",
        overflowY: "auto",
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
        "absolute z-30 bg-card p-2 min-w-[12rem] max-w-[calc(100vw-16px)]",
        "border border-border shadow-lg rounded-md",
        className
      )}
    >
      {children}
    </motion.div>
  );
}
