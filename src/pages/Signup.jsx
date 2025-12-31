// frontend/src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_BASE from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Signup failed");
      }

      if (data?.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("token", data.token);
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to fetch");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
          Create Account
        </h2>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Sign up for Finance Tracker
        </p>

        {error && (
          <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-800 p-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            className="w-full px-3 py-2 border rounded-md
                       bg-white text-black
                       dark:bg-gray-800 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full px-3 py-2 border rounded-md
                       bg-white text-black
                       dark:bg-gray-800 dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-400"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md">
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}