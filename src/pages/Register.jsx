import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.register(form);
      
      console.log("Full API Response:", response);
      
      // Handle different response formats
      const token = response.token || response.data?.token;
      const user = response.user || response.data?.user || response;
      const email = user.email || form.email;
      
      if (token) {
        localStorage.setItem("token", token);
      }
      
      if (email) {
        localStorage.setItem("userEmail", email);
      }

      console.log("Registration successful! Token:", token, "User:", user);
      
      // Redirect to role selection
      navigate("/select-role", { 
        state: { userData: user } 
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Logo & Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#01275a] via-[#023e8a] to-[#0466c8] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* Logo */}
          <div className="mb-12">
            <img 
              src="/logo.png" 
              alt="NextTaskers Logo" 
              className="w-48 h-48 drop-shadow-2xl"
            />
          </div>

          {/* Tagline */}
          <h1 className="text-6xl font-bold text-center mb-6 leading-tight">
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
              Get Anything
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-slow">
              Done
            </span>
          </h1>

          <p className="text-xl text-blue-100 text-center max-w-md leading-relaxed">
            Connect with skilled freelancers and turn your ideas into reality
          </p>

          {/* Decorative dots */}
          <div className="flex gap-2 mt-12">
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
            <div className="w-2 h-2 rounded-full bg-white/50"></div>
            <div className="w-2 h-2 rounded-full bg-white/70"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img 
              src="/logo.png" 
              alt="NextTaskers" 
              className="w-20 h-20 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#01275a] to-[#0466c8] bg-clip-text text-transparent">
              NextTaskers
            </h2>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join our community today</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                      ${focusedField === 'name' ? 'border-[#01275a] bg-white shadow-lg' : 'border-transparent hover:bg-gray-100'}`}
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                      ${focusedField === 'email' ? 'border-[#01275a] bg-white shadow-lg' : 'border-transparent hover:bg-gray-100'}`}
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                      ${focusedField === 'password' ? 'border-[#01275a] bg-white shadow-lg' : 'border-transparent hover:bg-gray-100'}`}
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    required
                    minLength="6"
                  />
                  <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 py-4 bg-gradient-to-r from-[#01275a] via-[#023e8a] to-[#0466c8] text-white font-semibold rounded-xl 
                  hover:shadow-lg hover:shadow-blue-500/50 active:scale-[0.98] transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Footer */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <a 
                    href="/login" 
                    className="font-semibold text-[#01275a] hover:text-[#0466c8] transition-colors"
                  >
                    Sign in
                  </a>
                </p>
              </div>

              {/* Terms */}
              <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-[#01275a] hover:underline">Terms</a>
                {" "}and{" "}
                <a href="/privacy" className="text-[#01275a] hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes gradient-slow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-gradient-slow {
          background-size: 200% 200%;
          animation: gradient-slow 5s ease infinite;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}