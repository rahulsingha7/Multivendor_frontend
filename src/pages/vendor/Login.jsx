/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import { jwtDecode } from "jwt-decode";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiMail, FiLock } from "react-icons/fi";
import AuthLayout from "../../components/shared/AuthLayout";
import AuthInput from "../../components/shared/AuthInput";

const VendorLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = getUserFromToken();
    if (user) navigate(`/${user.role}/dashboard`);
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
          expectedRole: "vendor",
        },
      );
      localStorage.setItem("token", res.data.token);
      navigate(`/${res.data.user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/google`,
        {
          id_token: idToken,
          role: "vendor",
        },
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      navigate(`/${user.role}/dashboard`);
    } catch {
      toast.error("Google login failed");
    }
  };

  return (
    <AuthLayout
      title="Vendor sign in"
      subtitle="Access your vendor dashboard"
      side="vendor"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          icon={FiMail}
          label="Email Address"
          type="email"
          name="email"
          placeholder="you@example.com"
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
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Sign In"
          )}
        </Motion.button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-line dark:bg-base-300" />
        <span className="text-sm text-base-content/40 font-medium">
          or continue with
        </span>
        <div className="flex-1 h-px bg-line dark:bg-base-300" />
      </div>

      <Motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleGoogleSignIn}
        className="w-full py-3.5 rounded-full border border-line dark:border-base-300 bg-base-100 hover:border-orange-400 transition flex items-center justify-center gap-3 text-base font-semibold text-base-content shadow-sm"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          className="w-5 h-5"
          alt="Google"
        />
        Sign in with Google
      </Motion.button>

      <div className="mt-8 space-y-2 text-center">
        <p className="text-base text-base-content/60">
          Don't have a vendor account?{" "}
          <Link
            to="/register/vendor"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
          >
            Register as vendor
          </Link>
        </p>
        <p className="text-base text-base-content/60">
          Are you a customer?{" "}
          <Link
            to="/login"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
          >
            Customer login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VendorLogin;
