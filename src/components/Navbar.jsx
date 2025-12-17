import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NexiTaskers
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Browse tasks
                </Link>
                
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Dashboard
                </Link>
                
                <Link 
                  to="/my-bids" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  My Bids
                </Link>
                
                <Link 
                  to="/wallet" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition flex items-center gap-1"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Wallet
                </Link>
                
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Profile
                </Link>

                <Link
                  to="/post-task"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Post a task
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Browse tasks
                </Link>
                
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  How it works
                </Link>
                
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition"
                >
                  Log in
                </Link>
                
                <Link
                  to="/register"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition"
                >
                  Sign up
                </Link>
                
                <Link
                  to="/post-task"
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition font-semibold shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Post a task
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 hover:text-blue-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}