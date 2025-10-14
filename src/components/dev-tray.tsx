import React, { ReactNode } from "react";

interface DevTrayProps {
  children: ReactNode;
}

export default function DevTray({ children }: DevTrayProps) {
  const devEnv = process.env.NODE_ENV === "development";
  if (!devEnv) return null;
  return (
  <div className="fixed left-16 bottom-5 flex items-center gap-2">
      {children}
    </div>
  );
}
