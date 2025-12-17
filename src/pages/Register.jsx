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
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("userEmail", response.user.email);

      console.log("Registration successful!", response);
      
      navigate("/select-role", { 
        state: { userData: response.user } 
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {/* Background blur effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden">
          {/* Header */}
          <div className="px-8 pt-12 pb-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500 text-sm">Join NextTaskers today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                    ${focusedField === 'name' ? 'border-blue-500 bg-white shadow-lg shadow-blue-100' : 'border-transparent hover:bg-gray-100'}`}
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>

              {/* Email Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                    ${focusedField === 'email' ? 'border-blue-500 bg-white shadow-lg shadow-blue-100' : 'border-transparent hover:bg-gray-100'}`}
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-2 ml-1">Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className={`w-full px-4 py-4 bg-gray-50 border-2 rounded-2xl transition-all duration-200 outline-none text-gray-900 placeholder-gray-400
                    ${focusedField === 'password' ? 'border-blue-500 bg-white shadow-lg shadow-blue-100' : 'border-transparent hover:bg-gray-100'}`}
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  minLength="6"
                />
                <p className="text-xs text-gray-500 mt-2 ml-1">Minimum 6 characters</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-2xl 
                hover:from-blue-700 hover:to-blue-800 active:scale-[0.98] transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-lg shadow-blue-500/30"
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
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Sign in
                </a>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-gray-500 text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="/terms" className="text-blue-600 hover:underline">Terms of Service</a>
              {" "}and{" "}
              <a href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}