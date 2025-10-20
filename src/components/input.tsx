import { cn } from "@/lib/utils";
import React, { HTMLAttributes, HTMLInputTypeAttribute } from "react";

interface InputProps extends HTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
}

export function Input({ className, placeholder, type, ...props }: InputProps) {
  return (
    <input
      placeholder={placeholder}
      type={type}
      className={cn(
        "rounded-lg sm:text-xl text-base px-2 py-1 bg-input",
        "border border-border shadow-sm",
        "focus:ring-1 focus:ring-ring transition duration-200",
        className
      )}
      {...props}
    />
  );
}
