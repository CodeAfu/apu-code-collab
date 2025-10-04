"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { div } from "motion/react-client";
import Link, { LinkProps } from "next/link";
import React, { useState } from "react";

interface NavLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> {
  label: string;
  href: string;
}

export default function NavLink({
  label,
  href,
  className,
  ...props
}: NavLinkProps) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div
      className="h-full relative overflow-hidden"
      initial={{
        rotate: "0deg",
      }}
      whileHover={{
        rotate: "5deg",
        scale: 1.4,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      {isHovered && <motion.div className="top-full"></motion.div>}

      <Link
        href={href}
        className={cn(
          "h-full px-2 w-full flex items-center justify-center relative z-10 transition-colors duration-200",
          "hover:text-white text-xl",
          className
        )}
        {...props}
      >
        {label}
      </Link>
    </motion.div>
  );
}
