// frontend/src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:5000";

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

      // ✅ Standardize token storage
      const token = data?.token;
      if (!token) throw new Error("Login succeeded but no token returned.");

      localStorage.setItem("authToken", token);
      localStorage.setItem("token", token); // keep both for compatibility
      if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (e) {
      setError(e.message || "Login error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6">
        <div className="text-xl font-bold mb-1">Login</div>
        <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Sign in to your Finance Tracker
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200 p-3">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full px-4 py-2 rounded-md bg-blue-600 text-white hover:opacity-90">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}