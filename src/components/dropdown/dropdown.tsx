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

type AnchorPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left-top"
  | "left-center"
  | "left-bottom"
  | "right-top"
  | "right-center"
  | "right-bottom";

interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  triggerNode: ReactNode;
  anchor?: AnchorPosition;
  offset?: number;
  preventOverflow?: boolean;
  parentClassName?: string;
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

  const triggerHeight = triggerRef.current?.clientHeight;
  const triggerWidth = triggerRef.current?.clientWidth;

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
    if (isOpen) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen]);

  return (
    <div className={cn("relative group flex flex-col items-center")}>
      <DropdownTrigger onClick={handleClick} ref={triggerRef}>
        {triggerNode}
      </DropdownTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownContent
            ref={contentRef}
            triggerHeight={triggerHeight}
            triggerWidth={triggerWidth}
            anchor={anchor}
            offset={offset}
            preventOverflow={preventOverflow}
            className={cn("", className)}
            {...props}
          >
            {children}
          </DropdownContent>
        )}
      </AnimatePresence>
    </div>
  );
}
