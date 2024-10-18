import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ThemeSwitch() {
  // Retrieve theme from localStorage (or default to light)
  const [theme, setTheme] = useState(
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );

  useEffect(() => {
    // Apply the current theme on load
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save the user's preference in localStorage
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex items-center justify-end">
      <motion.div
        className={`flex w-16 h-8 bg-gray-300 rounded-full p-1 cursor-pointer ${
          theme === "dark" ? "justify-end" : "justify-start"
        }`}
        onClick={toggleTheme}
        animate={{
          backgroundColor: theme === "dark" ? "#1F2937" : "#D1D5DB",
        }}
      >
        <motion.div
          className="w-6 h-6 bg-white rounded-full flex items-center justify-center"
          layout
          transition={spring}
        >
          <motion.div
            animate={{
              rotate: theme === "dark" ? 360 : 0,
            }}
            transition={{ duration: 0.7 }}
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4 text-gray-800" />
            ) : (
              <Sun className="w-4 h-4 text-yellow-500" />
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};
