import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl">Loading...</p>
    </div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    alert("Please login first to access this page!");
    return <Navigate to="/login" replace />;
  }

  return children;
}