import React from "react";
import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";

const FEATURES = [
  { icon: "🛍️", text: "500+ products across all categories" },
  { icon: "🔒", text: "Secure Stripe-powered payments" },
  { icon: "⭐", text: "Only verified vendor products" },
  { icon: "🚚", text: "Fast delivery, easy returns" },
];

const AuthLayout = ({ children, title, subtitle, side = "customer" }) => {
  const isVendor = side === "vendor";

  return (
    <div className="min-h-screen flex bg-cream dark:bg-base-200">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden bg-ink">
        {/* Blobs */}
        <Motion.div
          animate={{ y: [0, -18, 0], x: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-60px] left-[-60px] w-[280px] h-[280px] rounded-full blur-3xl opacity-50 pointer-events-none bg-orange-500"
        />
        <Motion.div
          animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className={`absolute bottom-[-50px] right-[-50px] w-[260px] h-[260px] rounded-full blur-3xl opacity-40 pointer-events-none ${
            isVendor ? "bg-teal-500" : "bg-gold-400"
          }`}
        />
        <Motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-1/3 right-16 w-3 h-3 rounded-full pointer-events-none ${
            isVendor ? "bg-teal-300" : "bg-gold-300"
          }`}
        />

        {/* Logo */}
        <Link to="/" className="inline-flex items-center relative z-10">
          <span className="text-2xl sm:text-3xl font-serif font-semibold tracking-tight">
            <span className="text-orange-400">Multi</span>
            <span className="text-cream">Vendor</span>
          </span>
        </Link>

        {/* Main copy */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="relative z-10"
        >
          <p className="text-sm uppercase tracking-[0.3em] font-semibold text-orange-400 mb-4">
            {isVendor ? "For Sellers" : "For Shoppers"}
          </p>
          <h2 className="font-serif text-4xl xl:text-5xl font-semibold text-cream leading-tight mb-6">
            {isVendor
              ? "Sell smarter, grow faster."
              : "Everything you need, in one place."}
          </h2>
          <p className="text-cream/60 text-lg mb-10 max-w-sm">
            {isVendor
              ? "Join hundreds of vendors reaching thousands of customers every day."
              : "Shop from hundreds of trusted vendors with secure checkout and verified reviews."}
          </p>

          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <Motion.div
                key={f.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <span className="text-lg">{f.icon}</span>
                <span className="text-cream/70 text-base">{f.text}</span>
              </Motion.div>
            ))}
          </div>
        </Motion.div>

        {/* Bottom badge */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex -space-x-2">
            {["🧑", "👩", "👨", "🧕"].map((e, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center text-sm"
              >
                {e}
              </div>
            ))}
          </div>
          <p className="text-cream/50 text-sm">
            Trusted by <span className="text-cream font-semibold">12,000+</span>{" "}
            users
          </p>
        </div>
      </div>

      {/* ── Right Panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link to="/" className="inline-flex items-center mb-8 lg:hidden">
          <span className="text-2xl font-serif font-semibold tracking-tight">
            <span className="text-orange-500">Multi</span>
            <span className="text-ink dark:text-base-content">Vendor</span>
          </span>
        </Link>

        <Motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-ink dark:text-base-content mb-2">
              {title}
            </h1>
            {subtitle && (
              <p className="text-base-content/60 text-base">{subtitle}</p>
            )}
          </div>

          {children}
        </Motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
