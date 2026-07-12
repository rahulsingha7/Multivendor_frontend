import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";

const PaymentCancel = () => {
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
          😕
        </Motion.div>
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-semibold text-ink dark:text-base-content mb-2">
          Payment Cancelled
        </h1>
        <p className="text-base-content/60 text-base mb-8">
          Your payment was cancelled and nothing was charged. Your cart is still
          saved — you can try again anytime.
        </p>
        <div className="flex flex-col gap-3">
          <Motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/customer/checkout"
              className="block w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg"
            >
              Try Again
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

export default PaymentCancel;
