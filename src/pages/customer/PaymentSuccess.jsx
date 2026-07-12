import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/useCart";
import { motion as Motion } from "framer-motion";

const PaymentSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-cream dark:bg-base-200 flex items-center justify-center px-4">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="bg-base-100 rounded-3xl shadow-xl border border-line dark:border-base-300 p-10 max-w-md w-full text-center"
      >
        <Motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="text-7xl mb-6"
        >
          🎉
        </Motion.div>
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-ink dark:text-base-content mb-2">
          Payment Successful!
        </h1>
        <p className="text-base-content/60 text-base mb-8">
          Thank you for your order. We're processing it now and you'll receive a
          confirmation soon.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8 text-center">
          {[
            { icon: "📦", label: "Order Placed" },
            { icon: "🚚", label: "Processing" },
            { icon: "✅", label: "Confirmed" },
          ].map(({ icon, label }) => (
            <div key={label}>
              <div className="text-2xl mb-1">{icon}</div>
              <p className="text-sm font-semibold text-base-content/60">
                {label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <Motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/customer/orders"
              className="block w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg"
            >
              View My Orders
            </Link>
          </Motion.div>
          <Motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/products"
              className="block w-full py-3.5 border border-line dark:border-base-300 text-base-content font-semibold rounded-full hover:border-orange-400 transition text-base"
            >
              Continue Shopping
            </Link>
          </Motion.div>
        </div>
      </Motion.div>
    </div>
  );
};

export default PaymentSuccess;
