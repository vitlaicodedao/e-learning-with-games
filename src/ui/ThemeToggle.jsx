import React from "react";
import { useTheme } from "./ThemeSwitcher";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <select
      className="px-3 py-2 rounded-lg bg-white/10 border border-white/20"
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="neon">Neon</option>
    </select>
  );
}