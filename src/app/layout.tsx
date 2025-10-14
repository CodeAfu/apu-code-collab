import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import Navbar from "@/app/_nav/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import ScreenSizeIndicator from "@/components/screen-size-indicator";

import "./globals.css";
import DevTray from "@/components/dev-tray";

export const metadata: Metadata = {
  title: "APU CodeSpace",
  description: "Collaborate in projects with your peers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("antialiased")}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <DevTray>
            <ThemeToggle />
          </DevTray>
          <ScreenSizeIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
