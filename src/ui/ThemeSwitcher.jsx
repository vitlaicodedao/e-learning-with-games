import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <select
      value={theme}
      onChange={(e) => toggleTheme(e.target.value)}
      style={{
        padding: "6px 12px",
        borderRadius: "8px",
        marginLeft: "10px",
      }}
    >
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="neon">Neon</option>
    </select>
  );
}
