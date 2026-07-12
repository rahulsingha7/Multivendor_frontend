import React, { useState, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import AuthLayout from "../../components/shared/AuthLayout";

const VendorVerify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  const handleDigit = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[idx] = val;
    setDigits(next);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setLoading(true);
    const token = localStorage.getItem("verifyToken");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/verify-email`,
        { email, code },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      localStorage.removeItem("verifyToken");
      setTimeout(() => navigate("/login/vendor"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  if (!email)
    return (
      <AuthLayout title="Session expired" side="vendor">
        <p className="text-base-content/60 mb-6 text-base">
          No email found. Please register again.
        </p>
        <Link
          to="/register/vendor"
          className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300 transition"
        >
          <FiArrowLeft size={15} /> Back to Register
        </Link>
      </AuthLayout>
    );

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${email}`}
      side="vendor"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <Motion.input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => handleDigit(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`w-12 h-14 text-center text-2xl font-serif font-semibold rounded-2xl border-2 outline-none transition bg-base-200 text-base-content
                ${d ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20" : "border-line dark:border-base-300 focus:border-orange-400"}`}
            />
          ))}
        </div>

        <Motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading || digits.join("").length < 6}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "Verify Email"
          )}
        </Motion.button>
      </form>

      <p className="text-center text-base text-base-content/40 mt-6">
        Wrong email?{" "}
        <Link
          to="/register/vendor"
          className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
        >
          Register again
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VendorVerify;
