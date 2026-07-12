import React from "react";
import { Link } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import { FiArrowLeft, FiShoppingBag } from "react-icons/fi";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-base-200 flex flex-col items-center justify-center px-4 text-center">
      <Motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        {/* Animated 404 */}
        <Motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="font-serif text-[120px] sm:text-[160px] font-semibold leading-none text-ink dark:text-base-content select-none">
            4<span className="text-orange-500">0</span>4
          </p>
        </Motion.div>

        <Motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-5xl mb-6"
        >
          🔍
        </Motion.div>

        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-ink dark:text-base-content mb-3">
          Page not found
        </h1>
        <p className="text-base-content/60 text-base mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-full transition shadow-sm hover:shadow-lg"
            >
              <FiArrowLeft size={16} /> Back to Home
            </Link>
          </Motion.div>
          <Motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-line dark:border-base-300 text-ink dark:text-base-content font-semibold text-base rounded-full hover:border-orange-400 transition"
            >
              <FiShoppingBag size={16} /> Shop Products
            </Link>
          </Motion.div>
        </div>
      </Motion.div>
    </div>
  );
};

export default NotFound;
