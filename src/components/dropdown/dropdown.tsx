import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import DropdownTrigger from "./dropdown-trigger";
import DropdownContent from "./dropdown-content";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "motion/react";
import { AnchorPosition } from "./types";

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  triggerNode: ReactNode;
  anchor?: AnchorPosition;
  offset?: number;
  preventOverflow?: boolean;
}

export default function Dropdown({
  triggerNode,
  children,
  anchor = "bottom-left",
  offset = 8,
  preventOverflow = true,
  className,
  ...props
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleClick = () => setIsOpen((prev) => !prev);
  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !contentRef.current.contains(e.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className={cn("relative w-full", className)}>
      <DropdownTrigger onClick={handleClick} ref={triggerRef}>
        {triggerNode}
      </DropdownTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownContent
            ref={contentRef}
            triggerRef={triggerRef}
            anchor={anchor}
            offset={offset}
            preventOverflow={preventOverflow}
            handleClose={handleClose}
            {...props}
          >
            {children}
          </DropdownContent>
        )}
      </AnimatePresence>
    </div>
  );
}
