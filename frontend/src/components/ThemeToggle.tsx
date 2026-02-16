"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleThemeToggling = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  return (
    <Button onPress={handleThemeToggling} isIconOnly>
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}

export default ThemeToggle;
