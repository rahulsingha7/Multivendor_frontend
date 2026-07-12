import React, { useState, useEffect } from "react";
import { useCart } from "../../context/useCart";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth";
import axios from "axios";
import { motion as Motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiArrowLeft,
  FiLock,
  FiTag,
  FiX,
  FiCheck,
} from "react-icons/fi";

const API = import.meta.env.VITE_API_BASE_URL;

const InputField = ({ icon: Icon, label, children }) => (
  <div>
    <label className="block text-xs font-semibold uppercase tracking-wider text-base-content/50 mb-2">
      {label}
    </label>
    <div className="flex items-start gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
      <Icon className="text-base-content/40 shrink-0 mt-0.5" size={15} />
      {children}
    </div>
  </div>
);

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const user = getUserFromToken();
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discountType, discountValue, discountAmount, finalAmount }

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShippingInfo((prev) => ({ ...prev, name: user.name || "" }));
  }, []);

  const handleChange = (e) =>
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });

  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const finalTotal = appliedCoupon ? appliedCoupon.finalAmount : originalTotal;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    setCouponLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/customer/coupons/validate`,
        { code: couponInput.trim(), orderAmount: originalTotal },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setAppliedCoupon({
        ...res.data.coupon,
        discountAmount: res.data.discountAmount,
        finalAmount: res.data.finalAmount,
      });
      toast.success(
        `Coupon applied! You save $${res.data.discountAmount.toFixed(2)} 🎉`,
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid coupon");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    toast.success("Coupon removed");
  };

  const handleProceed = async () => {
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("Please fill in all shipping fields");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API}/api/payment/create-checkout-session`,
        {
          customerId: user.id,
          cartItems,
          shippingInfo,
          couponCode: appliedCoupon?.code || null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.url) {
        window.location.href = res.data.url;
      } else {
        toast.error("Something went wrong with Stripe");
      }
    } catch {
      toast.error("Payment session failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200">
      {/* Header */}
      <div className="bg-base-100 border-b border-line dark:border-base-300 px-4 sm:px-10 lg:px-16 py-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="p-2 rounded-full hover:bg-base-200 transition text-base-content/60"
          >
            <FiArrowLeft size={18} />
          </button>
          <div>
            <p className="text-orange-600 dark:text-orange-400 text-sm uppercase tracking-[0.3em] font-semibold mb-0.5">
              Final Step
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content">
              Checkout
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-10 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: shipping + coupon */}
        <div className="lg:col-span-2 space-y-6">
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-2xl p-6 sm:p-7 shadow-sm border border-line dark:border-base-300"
          >
            <h2 className="font-serif font-semibold text-ink dark:text-base-content text-xl mb-6 flex items-center gap-2">
              <FiMapPin className="text-orange-600 dark:text-orange-400" />{" "}
              Shipping Details
            </h2>
            <div className="space-y-4">
              <InputField icon={FiUser} label="Full Name">
                <input
                  type="text"
                  name="name"
                  value={shippingInfo.name}
                  onChange={handleChange}
                  readOnly
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                />
              </InputField>
              <InputField icon={FiPhone} label="Phone Number">
                <input
                  type="text"
                  name="phone"
                  placeholder="+1 234 567 890"
                  value={shippingInfo.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
                />
              </InputField>
              <InputField icon={FiMapPin} label="Full Address">
                <textarea
                  name="address"
                  placeholder="123 Main St, City, ZIP"
                  value={shippingInfo.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40 resize-none"
                />
              </InputField>
            </div>
          </Motion.div>

          {/* Coupon section */}
          <Motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-base-100 rounded-2xl p-6 sm:p-7 shadow-sm border border-line dark:border-base-300"
          >
            <h2 className="font-serif font-semibold text-ink dark:text-base-content text-xl mb-4 flex items-center gap-2">
              <FiTag className="text-orange-600 dark:text-orange-400" /> Coupon
              Code
            </h2>

            <AnimatePresence mode="wait">
              {appliedCoupon ? (
                <Motion.div
                  key="applied"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                      <FiCheck size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-base">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-sm text-emerald-600 dark:text-emerald-500">
                        {appliedCoupon.discountType === "percentage"
                          ? `${appliedCoupon.discountValue}% off`
                          : `$${appliedCoupon.discountValue} off`}{" "}
                        — You save ${discountAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 hover:bg-emerald-200 transition"
                  >
                    <FiX size={13} />
                  </button>
                </Motion.div>
              ) : (
                <Motion.div
                  key="input"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex gap-3"
                >
                  <div className="flex-1 flex items-center gap-3 bg-base-200 rounded-xl px-4 py-3.5 border border-transparent focus-within:border-orange-400 transition">
                    <FiTag
                      className="text-base-content/40 shrink-0"
                      size={14}
                    />
                    <input
                      type="text"
                      placeholder="Enter coupon code (e.g. SAVE10)"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value.toUpperCase())
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleApplyCoupon()
                      }
                      className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40 uppercase font-semibold tracking-wider"
                    />
                  </div>
                  <Motion.button
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponInput.trim()}
                    className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-full transition text-base shrink-0 flex items-center gap-2 shadow-sm hover:shadow-lg"
                  >
                    {couponLoading ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      "Apply"
                    )}
                  </Motion.button>
                </Motion.div>
              )}
            </AnimatePresence>
          </Motion.div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-4 text-sm text-base-content/40 font-medium">
            {[
              "🔒 SSL Secure",
              "💳 Stripe Protected",
              "📦 Order Tracking",
              "↩️ Easy Returns",
            ].map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right: order summary */}
        <Motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-base-100 rounded-2xl p-6 sm:p-7 shadow-sm border border-line dark:border-base-300 h-fit sticky top-24"
        >
          <h2 className="font-serif font-semibold text-ink dark:text-base-content text-xl mb-5">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-base-content/40 text-base">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-3 mb-5">
              {cartItems.map((item) => (
                <div key={item.productId} className="flex gap-3 items-center">
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${API}/uploads/${item.image}`
                    }
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg shrink-0 bg-base-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-base-content truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-base-content/40">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-base font-bold text-base-content shrink-0">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-line dark:border-base-300 pt-4 mb-5 space-y-2">
            <div className="flex justify-between text-base text-base-content/60">
              <span>Subtotal</span>
              <span>${originalTotal.toFixed(2)}</span>
            </div>

            {/* Discount row */}
            <AnimatePresence>
              {appliedCoupon && (
                <Motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex justify-between text-base"
                >
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <FiTag size={12} /> {appliedCoupon.code}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    -${discountAmount.toFixed(2)}
                  </span>
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between items-center pt-2 border-t border-line dark:border-base-300">
              <span className="font-semibold text-base-content text-lg">
                Total
              </span>
              <div className="text-right">
                {appliedCoupon && (
                  <p className="text-sm text-base-content/40 line-through">
                    ${originalTotal.toFixed(2)}
                  </p>
                )}
                <span className="font-serif text-3xl font-semibold text-orange-600 dark:text-orange-400">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleProceed}
            disabled={cartItems.length === 0 || loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <>
                <FiLock size={14} /> Pay ${finalTotal.toFixed(2)} with Stripe
              </>
            )}
          </Motion.button>

          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            disabled={cartItems.length === 0}
            className="w-full mt-3 py-2.5 rounded-full text-base font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-40"
          >
            Clear Cart
          </button>
        </Motion.div>
      </div>
    </div>
  );
};

export default Checkout;
