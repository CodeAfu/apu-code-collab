import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import Navbar from "@/app/_nav/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import ScreenSizeIndicator from "@/components/screen-size-indicator";
import { Archivo, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import DevTray from "@/components/dev-tray";
import Footer from "@/components/footer";
import Providers from "@/providers/providers";

export const metadata: Metadata = {
  title: "APU CodeSpace",
  description: "Collaborate in projects with your peers",
};

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "antialiased",
          archivo.variable,
          jetbrainsMono.variable,
          archivo.className
        )}
      >
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <DevTray>
            <ThemeToggle />
          </DevTray>
          <ScreenSizeIndicator />
        </Providers>
      </body>
    </html>
  );
}
