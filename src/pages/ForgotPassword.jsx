import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FiMail, FiArrowLeft } from "react-icons/fi";
import AuthLayout from "../components/shared/AuthLayout";
import AuthInput from "../components/shared/AuthInput";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email },
      );
      setSent(true);
      toast.success("Reset link sent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="No worries, we'll send you a reset link."
      side="customer"
    >
      {sent ? (
        <Motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-6"
        >
          <div className="text-5xl mb-4">📧</div>
          <h3 className="font-serif text-xl font-semibold text-ink dark:text-base-content mb-2">
            Check your inbox
          </h3>
          <p className="text-base-content/60 text-base mb-6">
            We sent a password reset link to{" "}
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {email}
            </span>
            . It expires in 10 minutes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 text-base"
          >
            <FiArrowLeft size={15} /> Back to login
          </Link>
        </Motion.div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              icon={FiMail}
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
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
                "Send Reset Link"
              )}
            </Motion.button>
          </form>

          <p className="text-center text-base text-base-content/60 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
            >
              Back to login
            </Link>
          </p>
        </>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
