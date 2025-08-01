
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if user has already set a preference
    const savedTheme = localStorage.getItem("theme");
    
    // Only use the saved theme if it exists, otherwise default to light theme
    // Removed the system preference check to always default to light theme
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      // Ensure light theme is applied by default
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      // Store the default preference
      if (!savedTheme) {
        localStorage.setItem("theme", "light");
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-transparent bg-secondary text-foreground transition-colors hover:bg-secondary/80"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`h-4 w-4 transition-opacity ${isDarkMode ? "opacity-0 absolute" : "opacity-100"}`} />
      <Moon className={`h-4 w-4 transition-opacity ${isDarkMode ? "opacity-100" : "opacity-0 absolute"}`} />
    </button>
  );
};

export default ThemeToggle;
