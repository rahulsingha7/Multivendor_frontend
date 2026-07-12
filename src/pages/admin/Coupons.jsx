import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiTrash2,
  FiTag,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed Amount ($)" },
];

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    maxUses: "",
    expiresAt: "",
  });
  const token = localStorage.getItem("token");

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCoupons(res.data.coupons || []);
    } catch {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }
    setSaving(true);
    try {
      await axios.post(
        `${API}/api/admin/coupons`,
        {
          code: form.code.toUpperCase(),
          discountType: form.discountType,
          discountValue: parseFloat(form.discountValue),
          minOrderAmount: form.minOrderAmount
            ? parseFloat(form.minOrderAmount)
            : 0,
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Coupon created!");
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        maxUses: "",
        expiresAt: "",
      });
      setShowForm(false);
      fetchCoupons();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coupon?")) return;
    try {
      await axios.delete(`${API}/api/admin/coupons/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await axios.put(
        `${API}/api/admin/coupons/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success(res.data.message);
      fetchCoupons();
    } catch {
      toast.error("Failed to toggle coupon");
    }
  };

  const formatDiscount = (c) =>
    c.discountType === "percentage"
      ? `${c.discountValue}% off`
      : `$${c.discountValue} off`;
  const isExpired = (c) => c.expiresAt && new Date() > new Date(c.expiresAt);
  const isMaxed = (c) => c.maxUses && c.usedCount >= c.maxUses;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-600 dark:text-orange-400 mb-1">
            Admin
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
            Coupon Management
          </h1>
        </div>
        <Motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full transition shadow-sm hover:shadow-lg text-base"
        >
          <FiPlus size={15} />
          {showForm ? "Cancel" : "New Coupon"}
        </Motion.button>
      </div>

      {/* Create form */}
      <AnimatePresence>
        {showForm && (
          <Motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-base-100 rounded-2xl p-6 shadow-sm border border-line dark:border-base-300">
              <h2 className="font-serif text-xl font-semibold text-ink dark:text-base-content mb-5 flex items-center gap-2">
                <FiTag className="text-orange-600 dark:text-orange-400" />{" "}
                Create New Coupon
              </h2>
              <form
                onSubmit={handleCreate}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                {/* Code */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="e.g. SAVE20"
                    required
                    className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-4 py-3 text-base font-semibold uppercase tracking-wider outline-none transition text-base-content placeholder-base-content/40"
                  />
                </div>

                {/* Discount type */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="discountType"
                    value={form.discountType}
                    onChange={handleChange}
                    className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-4 py-3 text-base outline-none transition cursor-pointer text-base-content"
                  >
                    {DISCOUNT_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Discount value */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                    Discount Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="discountValue"
                    value={form.discountValue}
                    onChange={handleChange}
                    placeholder={
                      form.discountType === "percentage"
                        ? "e.g. 20 (for 20%)"
                        : "e.g. 10 (for $10)"
                    }
                    min="0"
                    step="0.01"
                    required
                    className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-4 py-3 text-base outline-none transition text-base-content placeholder-base-content/40"
                  />
                </div>

                {/* Min order amount */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                    Min Order Amount ($)
                  </label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={form.minOrderAmount}
                    onChange={handleChange}
                    placeholder="0 = no minimum"
                    min="0"
                    step="0.01"
                    className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-4 py-3 text-base outline-none transition text-base-content placeholder-base-content/40"
                  />
                </div>

                {/* Max uses */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                    Max Uses
                  </label>
                  <input
                    type="number"
                    name="maxUses"
                    value={form.maxUses}
                    onChange={handleChange}
                    placeholder="Leave empty = unlimited"
                    min="1"
                    className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-4 py-3 text-base outline-none transition text-base-content placeholder-base-content/40"
                  />
                </div>

                {/* Expiry date */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                    className="w-full bg-base-200 border border-transparent focus:border-orange-400 rounded-xl px-4 py-3 text-base outline-none transition text-base-content"
                  />
                </div>

                <div className="sm:col-span-2">
                  <Motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <>
                        <FiPlus size={14} /> Create Coupon
                      </>
                    )}
                  </Motion.button>
                </div>
              </form>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Coupons list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-base-100 border border-line dark:border-base-300 animate-pulse"
            />
          ))}
        </div>
      ) : coupons.length === 0 ? (
        <div className="text-center py-20 bg-base-100 rounded-2xl border border-line dark:border-base-300">
          <div className="text-5xl mb-3">🏷️</div>
          <p className="font-serif font-semibold text-base-content mb-1">
            No coupons yet
          </p>
          <p className="text-base-content/40 text-base">
            Create your first coupon to offer discounts
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon, i) => {
            const expired = isExpired(coupon);
            const maxed = isMaxed(coupon);
            const unusable = expired || maxed || !coupon.isActive;

            return (
              <Motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-base-100 rounded-2xl p-5 shadow-sm border border-line dark:border-base-300 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${coupon.isActive && !expired && !maxed ? "bg-orange-100 dark:bg-orange-900/30" : "bg-base-200"}`}
                  >
                    <FiTag
                      className={
                        coupon.isActive && !expired && !maxed
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-base-content/40"
                      }
                      size={18}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-base-content text-base tracking-wider">
                        {coupon.code}
                      </p>
                      {/* Status badges */}
                      {!coupon.isActive && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-base-200 text-base-content/40">
                          Disabled
                        </span>
                      )}
                      {expired && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500">
                          Expired
                        </span>
                      )}
                      {maxed && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gold-100 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400">
                          Maxed out
                        </span>
                      )}
                      {coupon.isActive && !expired && !maxed && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-sm text-base-content/40">
                      <span className="font-semibold text-orange-600 dark:text-orange-400">
                        {formatDiscount(coupon)}
                      </span>
                      {coupon.minOrderAmount > 0 && (
                        <span>Min: ${coupon.minOrderAmount}</span>
                      )}
                      {coupon.maxUses && (
                        <span>
                          Uses: {coupon.usedCount}/{coupon.maxUses}
                        </span>
                      )}
                      {!coupon.maxUses && (
                        <span>Uses: {coupon.usedCount} (unlimited)</span>
                      )}
                      {coupon.expiresAt && (
                        <span>
                          Expires:{" "}
                          {new Date(coupon.expiresAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggle(coupon._id)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition ${coupon.isActive ? "bg-base-200 text-base-content/60 hover:bg-base-300" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100"}`}
                  >
                    {coupon.isActive ? (
                      <FiToggleRight size={14} />
                    ) : (
                      <FiToggleLeft size={14} />
                    )}
                    {coupon.isActive ? "Disable" : "Enable"}
                  </button>
                  <button
                    onClick={() => handleDelete(coupon._id)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-full transition"
                  >
                    <FiTrash2 size={12} /> Delete
                  </button>
                </div>
              </Motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Coupons;
