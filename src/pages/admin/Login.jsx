import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiMail, FiLock, FiShield } from "react-icons/fi";
import AuthInput from "../../components/shared/AuthInput";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    if (user?.role === "admin") navigate("/admin/dashboard");
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
        {
          ...formData,
          expectedRole: "admin",
        },
      );
      localStorage.setItem("token", res.data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-cream dark:bg-base-200">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden bg-ink">
        {/* Blobs */}
        <Motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full blur-3xl opacity-40 pointer-events-none bg-red-500"
        />
        <Motion.div
          animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-[-50px] right-[-50px] w-[260px] h-[260px] rounded-full blur-3xl opacity-40 pointer-events-none bg-orange-500"
        />
        <Motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-16 w-3 h-3 rounded-full pointer-events-none bg-gold-300"
        />

        {/* Logo */}
        <Link to="/" className="inline-flex items-center relative z-10">
          <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight">
            <span className="text-orange-400">Multi</span>
            <span className="text-cream">Vendor</span>
          </span>
        </Link>

        {/* Main copy */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <FiShield className="text-orange-400 text-lg" />
            <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-400">
              Admin Portal
            </p>
          </div>
          <h2 className="font-serif text-4xl xl:text-5xl font-semibold text-cream leading-tight mb-6">
            Platform control centre.
          </h2>
          <p className="text-cream/60 text-lg mb-10 max-w-sm">
            Manage vendors, products, orders, and users from a single secure
            dashboard.
          </p>

          {/* Admin capabilities */}
          {[
            { icon: "🏪", text: "Approve & manage vendors" },
            { icon: "📦", text: "Moderate all products" },
            { icon: "🧾", text: "Oversee all orders" },
            { icon: "👥", text: "Manage user accounts" },
          ].map((f, i) => (
            <Motion.div
              key={f.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="text-lg">{f.icon}</span>
              <span className="text-cream/70 text-base">{f.text}</span>
            </Motion.div>
          ))}
        </Motion.div>

        {/* Restricted notice */}
        <div className="relative z-10 flex items-center gap-3 bg-cream/5 border border-cream/10 rounded-2xl px-4 py-3">
          <FiShield className="text-orange-400 shrink-0" />
          <p className="text-cream/50 text-sm">
            Restricted access — authorised personnel only
          </p>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link to="/" className="inline-flex items-center mb-8 lg:hidden">
          <span className="text-2xl font-serif font-semibold tracking-tight">
            <span className="text-orange-500">Multi</span>
            <span className="text-ink dark:text-base-content">Vendor</span>
          </span>
        </Link>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Admin badge */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-ink flex items-center justify-center">
              <FiShield className="text-orange-400 text-lg" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold text-base-content/40">
                Restricted
              </p>
              <p className="text-sm font-semibold text-base-content">
                Admin Access Only
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content mb-2">
              Admin sign in
            </h1>
            <p className="text-base-content/60 text-base">
              Enter your admin credentials to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={FiMail}
              label="Email Address"
              type="email"
              name="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <AuthInput
              icon={FiLock}
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition"
              >
                Forgot password?
              </Link>
            </div>

            <Motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-ink hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-60 text-cream dark:text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm" />
              ) : (
                <>
                  <FiShield size={16} /> Sign In to Dashboard
                </>
              )}
            </Motion.button>
          </form>

          <div className="mt-8 p-4 bg-base-200 rounded-2xl border border-line dark:border-base-300">
            <p className="text-sm text-base-content/50 text-center">
              Not an admin?{" "}
              <Link
                to="/login"
                className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
              >
                Customer login
              </Link>{" "}
              ·{" "}
              <Link
                to="/login/vendor"
                className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
              >
                Vendor login
              </Link>
            </p>
          </div>
        </Motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
