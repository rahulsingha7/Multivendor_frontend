import React, { useState } from "react";
import axios from "axios";
import { motion as Motion } from "framer-motion";
import { FiMail, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/newsletter/subscribe`,
        { email: email.trim() },
      );
      if (res.data?.alreadySubscribed) {
        toast.success("You're already on the list!");
      } else {
        toast.success("Subscribed! Welcome to the club.");
      }
      setEmail("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-base-200 px-4 sm:px-10 lg:px-16 py-16 sm:py-20">
      {/* Decorative blobs */}
      <Motion.div
        animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-teal-100 dark:bg-teal-900/30 z-0"
      />
      <Motion.div
        animate={{ y: [0, 14, 0], x: [0, -10, 0] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute -bottom-12 -right-12 w-56 h-56 rounded-full bg-orange-100 dark:bg-orange-900/20 z-0"
      />
      <Motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-1/4 w-4 h-4 rounded-full bg-gold-400 z-0"
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <Motion.span
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-2xl mb-3"
        >
          ✉️
        </Motion.span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mb-3 text-ink dark:text-base-content">
          Get 10% off your first order
        </h2>
        <p className="text-base-content/60 text-base sm:text-lg mb-8 max-w-xl mx-auto">
          Join our newsletter for new vendor drops, exclusive deals, and early
          access to sales. No spam, ever.
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <div className="w-full flex items-center gap-3 bg-base-100 border border-line dark:border-base-300 rounded-full px-5 py-3.5 focus-within:border-teal-400 transition">
            <FiMail className="text-base-content/40 shrink-0" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full bg-transparent outline-none text-base text-base-content placeholder-base-content/40"
            />
          </div>
          <Motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-semibold text-base bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm hover:shadow-lg disabled:opacity-60 shrink-0"
          >
            {loading ? "Subscribing..." : "Subscribe"}
            {!loading && <FiArrowRight size={16} />}
          </Motion.button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
