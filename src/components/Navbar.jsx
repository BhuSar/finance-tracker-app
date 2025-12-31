import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const logout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3
                    bg-white border-b border-gray-200
                    dark:bg-gray-900 dark:border-gray-800">
      <div className="flex items-center gap-2 text-lg font-semibold
                      text-gray-900 dark:text-gray-100">
        <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
        Finance Tracker
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md
                     bg-gray-200 text-gray-900 hover:bg-gray-300
                     dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700
                     transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}