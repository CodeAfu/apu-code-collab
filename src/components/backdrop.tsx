import { cn } from "@/lib/utils";
import React, { useState } from "react";

interface BackdropProps {
  onClose: () => void;
}

export default function Backdrop({
  onClose,
}: BackdropProps) {
  return (
    <div
      onClick={onClose}
      className={cn(
        "fixed inset-0 z-99 backdrop-blur-sm bg-black/10 animate-fade-in"
      )}
    />
  );
}
