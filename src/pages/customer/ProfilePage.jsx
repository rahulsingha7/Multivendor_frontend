import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiLock,
  FiShoppingBag,
  FiDollarSign,
  FiCheck,
  FiArrowLeft,
  FiArrowUpRight,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { getUserFromToken } from "../../utils/auth";
import AuthInput from "../../components/shared/AuthInput";

const API = import.meta.env.VITE_API_BASE_URL;

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <Motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-base-100 rounded-2xl p-5 shadow-sm border border-line dark:border-base-300 flex items-center gap-4"
  >
    <div
      className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0`}
    >
      <Icon size={18} className="text-white" />
    </div>
    <div>
      <p className="text-xs uppercase tracking-widest font-semibold text-base-content/40 mb-0.5">
        {label}
      </p>
      <p className="font-serif text-2xl font-semibold text-ink dark:text-base-content">
        {value}
      </p>
    </div>
  </Motion.div>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const tokenUser = getUserFromToken();
  const token = localStorage.getItem("token");

  const [profile, setProfile] = useState({ name: "", email: "" });
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    delivered: 0,
  });
  const [nameForm, setNameForm] = useState({ name: "" });
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingName, setSavingName] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const h = { Authorization: `Bearer ${token}` };
        const [profileRes, statsRes] = await Promise.all([
          axios.get(`${API}/api/auth/profile`, { headers: h }),
          axios.get(`${API}/api/customer/orders/stats`, { headers: h }),
        ]);
        setProfile(profileRes.data.user);
        setNameForm({ name: profileRes.data.user.name });
        setStats(statsRes.data);
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!nameForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setSavingName(true);
    try {
      await axios.put(
        `${API}/api/auth/profile`,
        { name: nameForm.name },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setProfile((p) => ({ ...p, name: nameForm.name }));
      // Update localStorage user object
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem(
        "user",
        JSON.stringify({ ...stored, name: nameForm.name }),
      );
      toast.success("Name updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    if (passForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSavingPass(true);
    try {
      await axios.put(
        `${API}/api/auth/profile`,
        {
          currentPassword: passForm.currentPassword,
          newPassword: passForm.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Password updated!");
      setPassForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPass(false);
    }
  };

  const joinedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-base-200 transition text-base-content/60"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-0.5">
              Account
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
              My Profile
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-10 lg:px-16 py-10 space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            {/* Profile card */}
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 p-6 sm:p-7 flex items-center gap-5"
            >
              <div className="w-16 h-16 rounded-full bg-orange-500 flex items-center justify-center text-white text-2xl font-serif font-semibold shrink-0">
                {profile.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink dark:text-base-content">
                  {profile.name}
                </h2>
                <p className="text-base text-base-content/40">
                  {profile.email}
                </p>
                {joinedDate && (
                  <p className="text-sm text-base-content/40 mt-1">
                    Member since {joinedDate}
                  </p>
                )}
              </div>
              <Motion.div
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="ml-auto hidden sm:block"
              >
                <Link
                  to="/customer/orders"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold text-base rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/40 transition"
                >
                  View Orders
                  <FiArrowUpRight size={15} />
                </Link>
              </Motion.div>
            </Motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                icon={FiShoppingBag}
                label="Total Orders"
                value={stats.totalOrders}
                color="bg-teal-600"
                delay={0.1}
              />
              <StatCard
                icon={FiDollarSign}
                label="Total Spent"
                value={`$${stats.totalSpent.toFixed(2)}`}
                color="bg-orange-500"
                delay={0.2}
              />
              <StatCard
                icon={FiCheck}
                label="Delivered"
                value={stats.delivered}
                color="bg-emerald-500"
                delay={0.3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Update name */}
              <Motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 p-6 sm:p-7"
              >
                <h3 className="font-serif text-xl font-semibold text-ink dark:text-base-content mb-5 flex items-center gap-2">
                  <FiUser className="text-orange-600 dark:text-orange-400" />{" "}
                  Update Name
                </h3>
                <form onSubmit={handleUpdateName} className="space-y-4">
                  <AuthInput
                    icon={FiUser}
                    label="Full Name"
                    type="text"
                    placeholder="Your name"
                    value={nameForm.name}
                    onChange={(e) => setNameForm({ name: e.target.value })}
                    required
                  />
                  <Motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={savingName}
                    className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {savingName ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Save Name"
                    )}
                  </Motion.button>
                </form>
              </Motion.div>

              {/* Update password */}
              <Motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-base-100 rounded-2xl shadow-sm border border-line dark:border-base-300 p-6 sm:p-7"
              >
                <h3 className="font-serif text-xl font-semibold text-ink dark:text-base-content mb-5 flex items-center gap-2">
                  <FiLock className="text-orange-600 dark:text-orange-400" />{" "}
                  Change Password
                </h3>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <AuthInput
                    icon={FiLock}
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    value={passForm.currentPassword}
                    onChange={(e) =>
                      setPassForm((p) => ({
                        ...p,
                        currentPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <AuthInput
                    icon={FiLock}
                    label="New Password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={passForm.newPassword}
                    onChange={(e) =>
                      setPassForm((p) => ({
                        ...p,
                        newPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <AuthInput
                    icon={FiLock}
                    label="Confirm New Password"
                    type="password"
                    placeholder="Repeat new password"
                    value={passForm.confirmPassword}
                    onChange={(e) =>
                      setPassForm((p) => ({
                        ...p,
                        confirmPassword: e.target.value,
                      }))
                    }
                    required
                  />
                  <Motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={savingPass}
                    className="w-full py-3.5 bg-ink hover:bg-orange-600 dark:bg-orange-500 dark:hover:bg-orange-600 disabled:opacity-60 text-cream dark:text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {savingPass ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "Update Password"
                    )}
                  </Motion.button>
                </form>
              </Motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
