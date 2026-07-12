import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import AuthLayout from "../../components/shared/AuthLayout";
import AuthInput from "../../components/shared/AuthInput";

const VendorRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
        {
          ...formData,
          role: "vendor",
        },
      );
      localStorage.setItem("verifyToken", res.data.token);
      toast.success("Verification code sent to your email!");
      navigate("/verify/vendor", { state: { email: formData.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Become a vendor"
      subtitle="Start selling to thousands of customers"
      side="vendor"
    >
      {/* Approval notice */}
      <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4 mb-6">
        <span className="text-lg mt-0.5">ℹ️</span>
        <p className="text-sm text-orange-700 dark:text-orange-300">
          Vendor accounts require admin approval before you can start selling.
          You'll be notified once approved.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput
          icon={FiUser}
          label="Business / Full Name"
          type="text"
          name="name"
          placeholder="Your name or business name"
          value={formData.name}
          onChange={handleChange}
          required
        />
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
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
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
            "Apply as Vendor"
          )}
        </Motion.button>
      </form>

      <div className="mt-8 space-y-2 text-center">
        <p className="text-base text-base-content/60">
          Already have a vendor account?{" "}
          <Link
            to="/login/vendor"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
          >
            Sign in
          </Link>
        </p>
        <p className="text-base text-base-content/60">
          Want to shop instead?{" "}
          <Link
            to="/register/customer"
            className="text-orange-600 dark:text-orange-400 font-semibold hover:text-orange-700 dark:hover:text-orange-300"
          >
            Customer register
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default VendorRegister;
