import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({
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
      const response = await authAPI.login(form);

      localStorage.setItem("token", response.token);
      localStorage.setItem("userEmail", response.email);

      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#01275a] via-[#023e8a] to-[#0466c8] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <img
            src="/logo.png"
            alt="NextTaskers"
            className="w-48 h-48 drop-shadow-2xl mb-10"
          />

          <h1 className="text-6xl font-bold text-center leading-tight mb-6">
            <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              Welcome
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Back
            </span>
          </h1>

          <p className="text-xl text-blue-100 text-center max-w-md">
            Login and continue getting things done effortlessly
          </p>
        </div>
      </div>

      {/* RIGHT LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.png" className="w-20 h-20 mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-blue-600">NextTaskers</h2>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Sign in
            </h2>
            <p className="text-gray-600 mb-8">
              Access your account
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl transition-all outline-none
                    ${
                      focusedField === "email"
                        ? "border-[#01275a] bg-white shadow-lg"
                        : "border-transparent hover:bg-gray-100"
                    }`}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  className={`w-full px-4 py-3.5 bg-gray-50 border-2 rounded-xl transition-all outline-none
                    ${
                      focusedField === "password"
                        ? "border-[#01275a] bg-white shadow-lg"
                        : "border-transparent hover:bg-gray-100"
                    }`}
                  required
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-4 bg-gradient-to-r from-[#01275a] via-[#023e8a] to-[#0466c8]
                  text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50
                  transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

              {/* FOOTER */}
              <p className="text-sm text-center text-gray-600 mt-6">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="font-semibold text-[#01275a] hover:text-[#0466c8]"
                >
                  Create one
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
