import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // If user is NOT logged in → redirect to login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user has a token → allow access
  return children;
}