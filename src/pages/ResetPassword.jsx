import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiLock, FiArrowLeft } from "react-icons/fi";
import AuthLayout from "../components/shared/AuthLayout";
import AuthInput from "../components/shared/AuthInput";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`,
        { password },
      );
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account."
      side="customer"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          icon={FiLock}
          label="New Password"
          type="password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <AuthInput
          icon={FiLock}
          label="Confirm Password"
          type="password"
          placeholder="Repeat your password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
        />

        {/* Strength hint */}
        {password.length > 0 && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    password.length >= i * 3
                      ? password.length >= 10
                        ? "bg-emerald-500"
                        : password.length >= 6
                          ? "bg-orange-400"
                          : "bg-red-400"
                      : "bg-line dark:bg-base-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-base-content/40">
              {password.length < 6
                ? "Too short"
                : password.length < 10
                  ? "Moderate"
                  : "Strong password ✓"}
            </p>
          </div>
        )}

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
            "Reset Password"
          )}
        </Motion.button>
      </form>

      <p className="text-center text-base text-base-content/60 mt-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
        >
          <FiArrowLeft size={15} /> Back to login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ResetPassword;
