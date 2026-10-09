import { useEffect, useState } from "react";
import type { Theme } from "../components/Header";

export default function useStoredTheme(): Theme {
  const [theme, setTheme] = useState<Theme>(() =>
    window.localStorage.getItem("alkutbi-theme") === "dark" ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f7f3e8" : "#03110a");

    const syncTheme = (event: StorageEvent) => {
      if (event.key === "alkutbi-theme") {
        setTheme(event.newValue === "dark" ? "dark" : "light");
      }
    };
    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, [theme]);

  return theme;
}

