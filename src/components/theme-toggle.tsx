"use client";

import React, { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(theme === "dark");
  }, [theme]);

  const handleClick = () => {
    switch (isDark) {
      case true:
        setTheme("light");
        setIsDark(false);
        return;
      case false:
        setTheme("dark");
        setIsDark(true);
        return;
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      className="rounded-full size-10"
    >
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
