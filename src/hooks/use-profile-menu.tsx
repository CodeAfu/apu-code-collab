import { useMemo } from "react";
import { useTheme } from "next-themes";
import { ProfileItemType } from "@/lib/types";
import {
  BookMarked,
  CircleUserRound,
  Moon,
  Sun,
} from "lucide-react";

export function useProfileMenu() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const profileMenus = useMemo<ProfileItemType[]>(
    () => [
      {
        type: "link",
        icon: <CircleUserRound />,
        href: "/profile",
        label: "Profile",
      },
      {
        type: "link",
        icon: <BookMarked />,
        href: "/profile/repositories",
        label: "Repositories",
      },
      {
        type: "separator",
      },
      {
        type: "button",
        icon: isDark ? <Sun /> : <Moon />,
        onClick: () => setTheme(isDark ? "light" : "dark"),
        label: isDark ? "Light Theme" : "Dark Theme",
      },
    ],
    [isDark, setTheme]
  );

  return profileMenus;
}
