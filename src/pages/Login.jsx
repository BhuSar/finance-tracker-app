// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      const token = data?.token;
      if (!token) throw new Error("Login succeeded but no token returned.");

      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token);
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      navigate("/dashboard");
    } catch (e) {
      setError(e.message || "Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <div className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
          Login
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Sign in to your Finance Tracker
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg 
                       bg-gray-100 dark:bg-[#0d1117]
                       border border-gray-300 dark:border-gray-700
                       text-black dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded-lg 
                       bg-gray-100 dark:bg-[#0d1117]
                       border border-gray-300 dark:border-gray-700
                       text-black dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500"
          />

          <button className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:opacity-90">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}