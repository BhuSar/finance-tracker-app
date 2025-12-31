import { useState } from "react";
import { login } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const res = await login(email, password);
        if (res.error) {
            setError(res.error);
            return;
        }

        localStorage.setItem("token", res.token);
        navigate("/");
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0d1117] px-6">

            {/* Logo */}
            <img src="/src/assets/logo.svg" className="w-16 mb-4" />

            <h1 className="text-3xl font-bold mb-6 text-blue-500">Finance Track</h1>

            <div className="bg-white dark:bg-[#1a1f29] p-6 rounded-xl shadow-lg w-full max-w-md">

                <h2 className="text-xl font-semibold mb-4 text-center dark:text-white">
                    Login
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        type="email"
                        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-[#0d1117] 
                                   border border-gray-300 dark:border-gray-700 
                                   text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-[#0d1117] 
                                   border border-gray-300 dark:border-gray-700 
                                   text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                        Log In
                    </button>
                </form>

                {error && <p className="text-red-500 text-center mt-2">{error}</p>}

                <p className="text-center mt-4 text-sm dark:text-gray-300">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-blue-500">Sign Up</Link>
                </p>

            </div>
        </div>
    );
}