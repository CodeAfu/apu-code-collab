"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import QueryProvider from "./query-provider";
import { useAuthSync } from "@/components/auth/use-auth-sync";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  useAuthSync();
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>{children}</QueryProvider>
    </ThemeProvider>
  );
}
