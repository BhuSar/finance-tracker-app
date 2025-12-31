import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <nav className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white px-6 py-3 shadow flex justify-between items-center transition-colors duration-300">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="logo" className="w-8 h-8" />
        <span className="font-semibold text-lg">Finance Tracker</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="px-3 py-1 rounded bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white transition"
        >
          {theme === "dark" ? "Light Mode 🌞" : "Dark Mode 🌙"}
        </button>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}